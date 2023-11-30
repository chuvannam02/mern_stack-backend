const express = require("express");
const router = express.Router();
const categoriesController = require("../../controllers/categoriesController");
const middlewareController = require("../../middleware/middlewareController");
// Route get all categories
router.get("/categories/all",middlewareController.verifyTokenAndAdmin,categoriesController.getAllCategories);

//Create an category
router.post("/categories/create",middlewareController.verifyTokenAndAdmin,categoriesController.createAnCategory);

//List item categories
router.get("/categories",middlewareController.verifyTokenAndAdmin,categoriesController.listItemCategories);
module.exports = router;