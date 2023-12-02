const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const middlewareController = require("../../middleware/middlewareController");

// Get all products
router.get(
  "/product/all",
  middlewareController.verifyTokenAndAdmin,
  productController.getAllProducts
);

router.get(
  "/product-without-authv1/all",
  productController.getAllProductsWithoutAuthenticatev1
);
router.get(
  "/product-without-auth/all",
  productController.getAllProductsWithoutAuthenticate
);
// Get a product with id
router.get("/product/find/:id", productController.getAProduct);

// create a new product
router.post(
  "/product/create",
  middlewareController.verifyTokenAndAdmin,
  productController.AddAProduct
);

// Delete a product with id
router.delete(
  "/product/delete",
  middlewareController.verifyTokenAndAdmin,
  productController.deleteAProduct
);

// Update a product with id
router.patch(
  "/product/update",
  middlewareController.verifyTokenAndAdmin,
  productController.updateAProduct
);
module.exports = router;
