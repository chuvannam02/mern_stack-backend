const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  page: Number,
  total_pages:Number,
  data:{
    id:Number,
    name:{
        type:String,
        required:true,
    },
    price:String,
    size:{
        0:Number,
        1:Number,
        2:Number
    },
    images1:String,
    images2:String,
    images3:String,
    images4:String,
    images5:String,
    cpu:String,
    ram:String,
    color:String,
    disk:String,
    vga:String,
    monitor:String,
    brand:String,
    views:String,
  }
},{timestamps: true});

const products = new mongoose.model("products", productsSchema);

module.exports = products;
