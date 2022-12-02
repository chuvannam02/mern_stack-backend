const Categories = require("../models/Categories");
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
      }else {
        const Categ = new Categories({name});
        const newCateg = await Categ.save();
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
module.exports = categoriesController;
