const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
// Get all products
router.get("/products/all",productController.getAllProducts)

// Get a product with id
router.get("/products/:id", productController.getAProduct)
module.exports = router;