const { Schema, model } = require("mongoose");
const ReceiptSchema = new Schema(
  {
    receiptId: { type: Number, required: true, unique: true },
    supplierId: { type: Number, required: true },
    date: { type: Date, required: true },
    note: { type: String },
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "receipts",
  }
);
module.exports = model("receipts", ReceiptSchema);
// receiptId: Một số nguyên duy nhất xác định phiếu nhập.
// supplierId: Một số nguyên xác định nhà cung cấp của phiếu nhập.
// date: Ngày nhập hàng.
// note: Ghi chú về phiếu nhập.
// totalAmount: Tổng số tiền của phiếu nhập.
// createdAt: Ngày giờ tạo phiếu nhập.
// updatedAt: Ngày giờ cập nhật phiếu nhập.