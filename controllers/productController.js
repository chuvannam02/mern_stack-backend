const Product = require("../models/Product.model");
// //GET ALL PRODUCTS
// router.get("/", async (req, res) => {
//   const qNew = req.query.new;
//   const qCategory = req.query.category;
//   try {
//     let products;

//     if (qNew) {
//       products = await Product.find().sort({ createdAt: -1 }).limit(1);
//     } else if (qCategory) {
//       products = await Product.find({
//         categories: {
//           $in: [qCategory],
//         },
//       });
//     } else {
//       products = await Product.find();
//     }

//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
const productController = {
  getAllProductsWithoutAuthenticate: async (req, res) => {
    try {
      const result = await Product.find({});
      if (!result) {
        return res.status(404).json({
          status: "FAILED",
          message: "Not found record",
        });
      } else {
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  // Get all Products
  getAllProducts: async (req, res) => {
    const countDocuments = await Product.countDocuments();
    let { page, limit } = req.query;
    const skip = (page - 1) * limit;
    page = Number.parseInt(page) || 1;
    limit = Number.parseInt(limit) || 5;
    if (limit >= countDocuments) limit = countDocuments;
    const totalPage = Math.ceil(countDocuments / limit);
    try {
     const results = await Product.find().limit(limit).skip(skip);
      if (!results.length) {
        return res.status(404).json({
          status: "FAILED",
          message: "Not found record",
        });
      } else {
        return res
        .status(200)
        .json({
          success: true,
          totalPage: totalPage,
          page: page,
          limit: limit,
          data: results,
        });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getAProduct: async (req, res) => {
    try {
      const { id } = req.params;
      // const result = await Product.find({"data.id":{$eq:id}});
      if (!result) {
        return res.status(404).json({
          status: "FAILED",
          message: "Not found any product with this id",
        });
      } else {
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // create a new Product
  AddAProduct: async (req, res) => {
    try {
      const { product } = req.body;
      const result = await Product.create(product);
      const savedProduct = await result.save();
      if (savedProduct) {
        return res.status(200).json({
          Status: "SUCCESS",
          message: "Insert a new product successfully",
          data: savedProduct,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "FAILED",
        message: error.message,
        data: [],
      });
    }
  },
  deleteAProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const result = await Product.findByIdAndDelete(productId);
      return res.status(200).json({
        status: "SUCCESS",
        message: "Product has been deleted...",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: "FAILED",
        message: err.message,
        data: [],
      });
    }
  },
  updateAProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json({
        status: "SUCCESS",
        message: "Product has been deleted...",
        data: updatedProduct,
      });
    } catch (err) {
      return res.status(500).json({
        status: "FAILED",
        message: err.message,
        data: [],
      });
    }
  },
};

module.exports = productController;
