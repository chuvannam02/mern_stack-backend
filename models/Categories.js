const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
    success:{
        type:Boolean
    },
    categories:{
        type:Array,
        name:{
            type:String,
            required:true
        }
    }
});
const Categories = new mongoose.model("categories", categoriesSchema);
module.exports = Categories;