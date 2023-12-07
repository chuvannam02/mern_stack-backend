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

//Combobox categories
// ,middlewareController.verifyTokenAndAdmin
router.get("/categories/combobox",middlewareController.verifyTokenAndAdmin,categoriesController.comboboxCategories);
router.get("/categories/combobox-without-auth",categoriesController.comboboxCategoriesWithoutAuth);

router.delete("/categories/delete/:id",middlewareController.verifyTokenAndAdmin,categoriesController.removeACategory);

router.put("/categories/update/:id",middlewareController.verifyTokenAndAdmin,categoriesController.updateACategory);
module.exports = router;