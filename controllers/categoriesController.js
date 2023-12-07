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
      let data = req.body.toString();
      let json = JSON.parse(data);
      const { name, status } = json;
      const checked = await Categories.findOne({ name });
      if (checked) {
        return res.status(400).json({ message: "This category is exist" });
      } else {
        const Categ = new Categories({ name, status });
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
      let { page, limit } = req.query;
      const skip = (page - 1) * limit;
      page = Number.parseInt(page);
      limit = Number.parseInt(limit);
      if (limit >= countDocuments) limit = countDocuments;
      const totalPage = Math.ceil(countDocuments / limit);
      const results = await Categories.find().limit(limit).skip(skip);
      return res.status(200).json({
        success: true,
        totalPage: totalPage,
        page: page,
        limit: limit,
        data: results,
        totalItems: countDocuments,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
  comboboxCategories: async (req, res) => {
    try {
      const results = await Categories.find({ status: "active" });
      return res.status(200).json({ success: true, data: results });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  comboboxCategoriesWithoutAuth: async (req, res) => {
    try {
      const results = await Categories.find({ status: "active" });
      return res.status(200).json({ success: true, data: results });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  removeACategory: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Categories.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: `Xoá danh mục ${result.name} thành công`,
        result: result,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  updateACategory: async (req, res) => {
    try {
      const { id } = req.params;
      let data = req.body.toString();
      let json = JSON.parse(data);
      const { name, status } = json;
      const checked = await Categories.findOne({ name });
      if (checked) {
        return res.status(400).json({ message: "This category is exist" });
      } else {
        const updatedFields = { name, status };
        for (const [key, value] of Object.entries(updatedFields)) {
          if (typeof value === "string") {
            updatedFields[key] = value.trim();
            if (value.trim() === null || value.trim() === "") {
              delete updatedFields[key];
            }
          } else if (value === null) {
            delete updatedFields[key];
          }
        }
        const result = await Categories.findByIdAndUpdate(id, updatedFields, {
          new: true,
        });
        if (!result) {
          return res.status(400).json({
            status: "FAILED",
            message: "Record is not updated successfully",
          });
        } else {
          return res.status(200).json({
            status: "SUCCESS",
            message: "Record is updated successfully",
            data: result,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
module.exports = categoriesController;
