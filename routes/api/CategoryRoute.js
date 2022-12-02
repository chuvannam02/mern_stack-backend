const express = require("express");
const router = express.Router();
const categoriesController = require("../../controllers/categoriesController");
// Route get all categories
router.get("/api/categories/all",categoriesController.getAllCategories);

module.exports = router;