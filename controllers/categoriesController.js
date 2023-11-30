const Categories = require("../models/Categories.model");
const categoriesController = {
  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categ = await Categories.find();
      if (!categ) {
        return res.status(404).json({
          success: false,
          message: "Not found any categories in database",
        });
      } else {
        return res.status(200).json({ success: true, data: categ.data });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  createAnCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const checked = await Categories.findOne({ name });
      if (checked) {
        return res.status(400).json({ message: "This category is exist" });
      } else {
        const Categ = new Categories({ name });
        const newCateg = await Categ.save();
        return res.status(200).json({ success: true, data: newCateg });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  listItemCategories: async (req, res) => {
    try {
      const countDocuments = await Categories.countDocuments();
      let { page , limit} = req.query;
      const skip = (page - 1) * limit;
      page = Number.parseInt(page);
      limit = Number.parseInt(limit);
      if (limit >= countDocuments) limit = countDocuments;
      const totalPage = Math.ceil(countDocuments / limit);
      const results = await Categories.find().limit(limit).skip(skip);
      return res.status(200).json({ success: true,totalPage:totalPage,page:page,limit:limit, data: results });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
};
module.exports = categoriesController;
