const {Schema, model} = require('mongoose');

//Inventory model
const InventorySchema = new Schema({
    productId:Number,
    quantity:Number, 
    inventoryId: { type: Number, required: true, unique: true },
    // Sô  lượng tồn kho hiện tại của sản phẩm này
    // 1000 => 990 => 970
    reservation:Array,
    // đặt trước
    /*
        [
            {
                userId: 1,
                quantity: 10
            },
            {
                userId: 2,
                quantity: 20
            }
        ]
    */

    created_At:{type:Date, default:Date.now},
},{
    // collection:'inventories',
    timestamps:true
});

module.exports = model('inventories', InventorySchema);