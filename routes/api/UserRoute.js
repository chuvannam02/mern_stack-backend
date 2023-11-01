const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const middlewareController = require("../../middleware/middlewareController");

// Create a new user
router.post(
  "/user",
  middlewareController.verifyToken,
  userController.createUser
);

// Search User
router.get(
  "/user/search",
  middlewareController.verifyToken,
  userController.searchUser
);

// get all records
router.get(
  "/user/all",
  middlewareController.verifyToken,
  userController.getAllUsers
);

// get single record
router.get("/user/:id", userController.getAnUser);

// update record
router.patch(
  "/user/update/:id",
  middlewareController.verifyToken,
  userController.updateUser
);

// delete record
router.delete(
  "/user/delete/:id",
  middlewareController.verifyToken,
  userController.deleteUser
);

module.exports = router;
