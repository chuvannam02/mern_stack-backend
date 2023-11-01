const {Schema, model} = require('mongoose');

//Cart model
const CartSchema = new Schema({
    userId:Number,
    cartId:Number,
    status:{
        type:String,
        enum:['active','inactive'] ,
        default:'active'},
    modifiedOn:{type:Date, default:Date.now},
    products:Array
    /*
    [
        {
            productId:123,
            quantity:2
        }
    ]
    */
},{
    // collection:'carts',
    timestamps:true
});

module.exports = model('carts', CartSchema);