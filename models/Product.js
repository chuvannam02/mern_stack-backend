const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const productSchema = new mongoose.Schema({
    name: {
        type:String,
        trim:true,
        required:[true, 'Please add a Product name'],
        maxlength:50
    },
    description:  {
        type:String,
        trim:true,
        required:[true, 'Please add a product description'],
        maxlength:2000
    },
    price: {
        type:Number,
        trim:true,
        required:[true,"Product must have a price"],
        maxlength:25
    },
    image: {
        type:String
    },
    category:{
        type: ObjectId,
        ref:"Category",
        required:[true,'Product must belong to a category']
    }
});
const Product = new mongoose.model("product", productSchema);
module.exports = Product;