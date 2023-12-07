const Product = require("../models/Product.model");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });
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
  getAllProductsWithoutAuthenticatev1: async (req, res) => {
    try {
      const result = await Product.find({});
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
  getAllProductsWithoutAuthenticate: async (req, res) => {
    try {
      let { page = 1, limit = 5, name, category } = req.query;
      page = Number.parseInt(page);
      limit = Number.parseInt(limit);

      const query = {};

      if (category) {
        query.categoryId = category; // Assuming categoryId is the ID of the category
      }

      const skip = (page - 1) * limit;

      let result;
      if (name) {
        result = await Product.find(query)
          .skip(skip)
          .limit(limit)
          .find({ name: { $regex: name, $options: "i" } });
      } else {
        result = await Product.find(query).skip(skip).limit(limit);
      }

      if (!result || result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No records found",
        });
      }

      const countDocuments = await Product.countDocuments(query);
      const totalPage = Math.ceil(countDocuments / limit);

      return res.status(200).json({
        success: true,
        totalPage,
        totalItems: countDocuments,
        page,
        limit,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
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
  getAProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Product.findOne({ productId: { $eq: id } }).populate(
        "categoryId"
      );
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
      const uploader = async (path) => await cloudinary.uploader.upload(path);
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
      let productId;
      let existingProduct;
      do {
        productId = Math.floor(Math.random() * 1000000);
        existingProduct = await Product.findOne({ productId: productId });
      } while (existingProduct);
      const {
        code,
        name,
        brand,
        description,
        releaseDate,
        specs,
        price,
        salePrice,
        categoryId,
      } = req.body;
      const product = new Product({
        productId: productId,
        code,
        name,
        brand,
        description,
        releaseDate,
        specs,
        price,
        salePrice,
        images: urls,
        categoryId,
      });
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
