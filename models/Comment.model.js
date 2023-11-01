const {Schema, model} = require('mongoose');
const CommentSchema = new Schema({
    productId:Number,
    userId:Number,
    commentId:Number,
    content:String,
    rating:Number,
    created_At:{type:Date, default:Date.now},
},{
    collection:'comments',
    timestamps:true
});
module.exports = model('comments', CommentSchema);