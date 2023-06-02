const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const bodyparser = require("body-parser");
dotenv.config();
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
let refreshTokens = [];
const authController = {
  // Register
  registerUser: async (req, res) => {
    try {
      const { email, name, password, address, phonenumber } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ error: "You must enter an email address." });
      }

      if (!name) {
        return res.status(400).json({ error: "You must enter your name." });
      }

      if (!password) {
        return res.status(400).json({ error: "You must enter a password." });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "That email address is already in use." });
      }
      const user = new User({
        email,
        password,
        name,
        phonenumber,
        address,
      });
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.password, salt);
      user.password = hashPassword;
      const registeredUser = await user.save();

      const payload = {
        id: registeredUser._id,
        admin: registeredUser.admin,
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });

      return res.status(200).json({
        success: true,
        token: `Bearer ${token}`,
        user: {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          role: registeredUser.role,
          phonenumber: registeredUser.phonenumber,
          address: registeredUser.address,
        },
      });
    } catch (error) {
      return res.status(200).json({ error: error.message });
    }
  },
  //   GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "365d",
      }
    );
  },
  //   GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "365d",
      }
    );
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json("You must enter an email address");
      }

      if (!password) {
        return res.status(400).json("You must enter a password");
      }

      if (!email && !password) {
        return res.status(400).json("You must enter all fields");
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json("No user found for this email address");
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json("Password Incorrect");
      }
      if (validPassword && user) {
        const accessToken = authController.generateAccessToken(user);
        if (!accessToken) {
          throw new Error();
        }
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        if (!refreshToken) {
          throw new Error();
        }
        const { password, ...others } = user._doc;
        return res
          .status(200)
          .cookie("refreshToken", refreshToken, {
          domain:"mern-stack-frontend.onrender.com",
           sameSite: "None",
       secure: true,
    httpOnly: true,
            path: "/",
          })
          .json({
            success: true,
            accessToken: `Bearer ${accessToken}`,
            user: {
              ...others,
            },
          });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  requestRefreshToken: async (req, res, refreshToken1) => {
    // Take refresh token from user
    // const refreshToken = req.cookies.refreshToken;
    const refreshToken = req.body.refreshToken1;
    if (!refreshToken) return res.status(401).json("You are not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh Token is not valid");
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      // Create new accessToken, refresh token
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      return res
        .cookie("refreshToken", newRefreshToken, {
        domain:"mern-stack-frontend.onrender.com",
          sameSite: "None",
       secure:true,
    httpOnly: true,
          path: "/",
        })
        .status(200)
        .json({ accessToken: newAccessToken });
    });
  },
  //   Log Out
  userLogout: async (req, res) => {
    res.clearCookie("refreshToken", {
      domain:"mern-stack-frontend.onrender.com",
         sameSite: "None",
       secure: true,
    httpOnly: true,
      path: "/",
    });
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logged out successfully");
  },
  forget_password: async (req, res) => {
    try {
      const email = req.body.email;
      const userData = await User.findOne({ email: email });
      if (userData) {
        const randomString = randomstring.generate();
        const data = await User.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        authController.sendResetPasswordMail(
          userData.name,
          userData.email,
          randomString
        );
        return res.status(200).json({
          success: true,
          msg: "Please check your inbox of mail and reset your password",
        });
      } else {
        return res
          .status(404)
          .json({ success: true, msg: "This email does not exist!" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  },
  sendResetPasswordMail: async (name, email, token) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "For reset password",
        html:
          "<p>Hii " +
          name +
          ", Vui lòng sao chép đường dẫn dưới đây (Hoặc ấn vào dòng chữ gạch chân)<a href=https://mern-stack-frontend.onrender.com/reset_password/"+
          token +
          "> để tiến hành nhập mật khẩu mới"+ "</a>" +
          ": " +
          "https://mern-stack-frontend.onrender.com/reset_password/" +
          token +
          "</p>",
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Mail has been sent: ", info.response);
        }
      });
    } catch (error) {}
  },
  reset_password: async (req, res) => {
    try {
      const { token } = req.params;
      const tokenData = await User.findOne({ token });
      const { password } = req.body;
      if (tokenData && password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = await User.findByIdAndUpdate(
          { _id: tokenData._id },
          { $set: { password: hashedPassword, token: "" } },
          { new: true }
        );
        userData.save();
        if (userData) {
          return res.status(200).json({
            success: true,
            msg: "User Password has been reset",
            data: userData,
          });
        }
      } else {
        return res.status(400).json({
          success: true,
          msg: "This link has been exprired.",
          data: tokenData,
          password: password,
          token: token,
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  },
};

module.exports = authController;
