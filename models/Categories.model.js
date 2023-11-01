const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    // categories:{
    //     type:Array,
    //     name:{
    //         type:String,
    //         required:true
    //     }
    // }
    name:{
        type:String,
        required:true
    }
    ,categoryId:{ type: mongoose.Schema.Types.ObjectId }
});
const Categories = new mongoose.model("categories", categoriesSchema);
module.exports = Categories;