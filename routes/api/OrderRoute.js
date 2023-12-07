const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/orderController");
const middlewareController = require("../../middleware/middlewareController");
router.get("/orders/all",middlewareController.verifyTokenAndAdmin,orderController.getAllOrder);
module.exports = router;