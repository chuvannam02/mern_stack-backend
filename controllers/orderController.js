const Order = require("../models/Order.model");
const orderController = {
  getAllOrderForAdmin: async (req, res) => {
    try {
      const result = await Order.find({});
      return res.status(200).json({
        success: true,
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
  updateOrderForAdmin: async (req, res) => {
    try {
      const result = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
  deleteOrderForAdmin: async (req, res) => {
    try {
      const result = await Order.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
  getUserOrder: async (req, res) => {
    try {
      const result = await Order.find({ user_id: req.params.id });
      return res.status(200).json({
        success: true,
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = orderController;
