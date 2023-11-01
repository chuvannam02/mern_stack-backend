const Inventories = require("../models/Iventories.model");
const inventoriesController = {
  // addAnInventory
  addAnInventory: async (req, res) => {
    try {
      const { inventory } = req.body;
      const result = await Inventories.create(inventory);
      return res.status(200).json({
        status: "SUCCESS",
        message: "Create an new inventory successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
module.exports = inventoriesController;
