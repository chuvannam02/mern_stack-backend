const authController = require("../../controllers/authController");
const middlewareController = require("../../middleware/middlewareController");

const router = require("express").Router();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Refresh
router.post("/refresh",authController.requestRefreshToken);

// Logout
router.post("/logout",authController.userLogout);

// reset password
router.patch("/reset-password/:token", authController.reset_password);

// forget password
router.post("/forget-password", authController.forget_password);
module.exports = router;