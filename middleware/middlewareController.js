const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const middlewareController = {
  // verify token
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      // Bearer 1234125asd( lấy vế sau là token)
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not authenticated");
    }
  },
  verifyTokenAndUserAuthorization: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.admin) {
        next();
      } else {
        return res.status(403).json("You're not allow to delete other");
      }
    });
  },
  verifyTokenAndAdmin: (req, res, next) => {
  middlewareController.verifyToken(req, res, () => {
    if (req.user.admin === true) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
},
};

module.exports = middlewareController;
