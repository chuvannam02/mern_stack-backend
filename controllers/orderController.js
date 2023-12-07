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
  getAllOrder: async (req, res) => {
    const countDocuments = await Order.countDocuments();
    let { page, limit } = req.query;
    const skip = (page - 1) * limit;
    page = Number.parseInt(page) || 1;
    limit = Number.parseInt(limit) || 5;
    if (limit >= countDocuments) limit = countDocuments;
    const totalPage = Math.ceil(countDocuments / limit);
    try {
      const results = await Order.find().limit(limit).skip(skip);
      if (!results.length) {
        return res.status(404).json({
          status: "FAILED",
          message: "Not found record",
        });
      } else {
        return res.status(200).json({
          success: true,
          totalPage: totalPage,
          page: page,
          limit: limit,
          data: results,
          totalItems: countDocuments,
        });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = orderController;
