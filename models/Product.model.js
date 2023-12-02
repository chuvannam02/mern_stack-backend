const mongoose = require("mongoose");
// const {ObjectId} = mongoose.Schema;
const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    code: String,
    name: String,
    brand: String,
    description: String,
    releaseDate: Date,
    specs: { type: Array, default: [] },
    price: Number,
    salePrice: Number,
    images: { type: Array, default: [] },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
  },
  {
    collection: "products",
    timestamps: true,
  }
);
const Product = new mongoose.model("product", productSchema);
module.exports = Product;
