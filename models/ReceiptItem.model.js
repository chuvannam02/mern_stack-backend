const { Schema, model } = require("mongoose");

const ReceiptItemSchema = new Schema({
  receiptId: { type: Number, required: true },
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
});

module.exports = model("ReceiptItems", ReceiptItemSchema);
// receiptId: Số nguyên xác định phiếu nhập mà mặt hàng được liên kết.
// productId: Số nguyên xác định sản phẩm được nhập.
// quantity: Số lượng sản phẩm được nhập.
// unitPrice: Giá của một đơn vị sản phẩm.
// amount: Tổng số tiền của mặt hàng.