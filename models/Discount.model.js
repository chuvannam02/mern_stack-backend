const { Schema, model } = require("mongoose");
const DiscountSchema = new Schema(
  {
    discountId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String },
    value: { type: Number },
    startAt: { type: Date },
    endAt: { type: Date },
    products: { type: Array },
    categories: { type: Array },
  },
  {
    collection: "discounts",
    timestamps: true,
  }
);
module.exports = model("discounts", DiscountSchema);
// discountId: Một số nguyên duy nhất xác định giảm giá.
// name: Tên của giảm giá.
// description: Mô tả giảm giá.
// type: Loại giảm giá, chẳng hạn như giảm giá theo giá trị hoặc giảm giá theo phần trăm.
// value: Giá trị của giảm giá.
// startAt: Ngày bắt đầu của giảm giá.
// endAt: Ngày kết thúc của giảm giá.
// products: Danh sách các sản phẩm được giảm giá.
// categories: Danh sách các danh mục sản phẩm được giảm giá.