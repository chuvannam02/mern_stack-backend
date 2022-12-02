const Products = require("../models/Products.js")
const productController = {
  // Get all Products
  getAllProducts: async (req, res) => {
    try {
      const result = await Products.find({});
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
  getAProduct: async (req, res)=> {
    try {
      const {id} = req.params;
      const result = await Products.find({"data.id":{$eq:id}});
      if ( !result) {
        return res.status(404).json({status:"FAILED",message:"Not found any product with this id"});
      } else {
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json({error:error.message});
    }
  }
};

module.exports = productController;
