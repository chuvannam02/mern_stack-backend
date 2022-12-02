const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const userController = {
  // Get All Users
  getAllUsers: async (req, res) => {
    try {
      const result = await User.find();
      if (!result) {
        res.status(400).json({
          status: "FAILED",
          message: "Not found record",
        });
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
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
        expiresIn: "30s",
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
  // Create a new User
  createUser: async (req, res) => {
    const { password, name, email, phonenumber, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "That email address is already in use." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const data = new User({
      email,
      password: hashedPassword,
      name,
      phonenumber,
      address,
    });
    const result = await data.save();

    if (!result) {
      res.json({
        status: "FAILED",
        message: "user not register successfully....",
      });
    } else {
      res.json({
        status: "SUCCESS",
        message: "user register successfully....",
        data: result,
      });
    }
  },
  //   Get information, record about an user
  getAnUser: async (req, res) => {
    try {
      const _id = req.params.id;
      const result = await User.findById(_id);
      if (!result) {
        res.status(400).json({
          status: "FAILED",
          message: "Record not found in this ID",
        });
      } else {
        res.status(200).json({
          status: "SUCCESS",
          message: "Record found",
          data: result,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //   Update a record
  updateUser: async (req, res) => {
    try {
      const _id = req.params.id;
      const result = await User.findByIdAndUpdate(_id, req.body, {
        runValidators: true,
        new: true,
      });
      if (!result) {
        return res.status(400).json({
          status: "FAILED",
          message: "Record is not updated successfully",
        });
      } else {
        return res.status(200).json({
          status: "SUCCESS",
          message: "Record is updated successfully",
          data: result,
        });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  //   Delete an user
  deleteUser: async (req, res) => {
    try {
      const _id = req.params.id;
      const result = await User.findByIdAndDelete(_id);
      if (!result) {
        res.status(400).json({
          status: "FAILED",
          message: "Record is not deleted successfully",
        });
      } else {
        res.status(200).json({
          status: "SUCCESS",
          message: "Record is deleted successfully",
          data: result,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;
