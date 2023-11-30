const {Schema, model} = require('mongoose');

//Order model

const OrderSchema = new Schema({
    cartId:Number,
    userId:Number,
    orderId:Number,
    shipping:Object, 
    // {
    //     name:String,
    //     address:String,
    //     state:String,

    // },
    payment:Object,
    // {
    //     name:String,
    //     cardNumber:Number,
    //     expiryDate:String,
    //     cvv:Number,
    // },
    products:Array,
    //  [
    //     {
    //         productId:Number,
    //         quantity:Number
    //     }
    // ]
    
},{
    // collection:'orders',
    timestamps:true
});

module.exports = model('orders', OrderSchema);  