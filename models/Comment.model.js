const { Schema, model } = require("mongoose");
const CommentSchema = new Schema(
  {
    productId: Number,
    userId: Number,
    commentId: Number,
    content: String,
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
    created_At: { type: Date, default: Date.now },
  },
  {
    collection: "comments",
    timestamps: true,
  }
);
module.exports = model("comments", CommentSchema);
