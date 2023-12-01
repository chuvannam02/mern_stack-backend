const authController = require("../../controllers/authController");
const middlewareController = require("../../middleware/middlewareController");

const router = require("express").Router();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Refresh
router.post(
  "/refresh",
  // middlewareController.verifyToken,
  authController.requestRefreshToken
);

// Logout
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.userLogout
);

// reset password
router.patch(
  "/reset-password/:token",
  middlewareController.verifyToken,
  authController.reset_password
);

// forget password
router.post(
  "/forget-password",
  middlewareController.verifyToken,
  authController.forget_password
);

module.exports = router;
