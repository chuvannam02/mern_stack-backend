const inventoriesController = require("../../controllers/inventoriesController");
const router = require("express").Router();

// Create an new Inventory
router.post("/inventory/create", inventoriesController.addAnInventory);

module.exports = router;
