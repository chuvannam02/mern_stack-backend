const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const middlewareController = require("../../middleware/middlewareController");
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });
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
  upload.array("images"),
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
