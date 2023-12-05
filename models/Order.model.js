const {Schema, model} = require('mongoose');

//Order model

const OrderSchema = new Schema({
    cartId:Number,
    userId:String,
    orderId:Number,
    shipping:Object, 
    // {
    //     name:String,
    //     address:String,
    //     state:String,
    //      email:String,

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
    delivery_status:String,
    total:Number,
    subTotal:Number,
    
},{
    // collection:'orders',
    timestamps:true
});

module.exports = model('orders', OrderSchema);  