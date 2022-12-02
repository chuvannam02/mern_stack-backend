const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "This email is already exist"],
    minlength:3,
    maxlength:50
  },
  phonenumber: {
    type: Number,
    minlength: 8,
    maxlength:13
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  admin:{
    type:Boolean,
    default:false
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  token:{
    type:String,
    default:'',
  }
},{timestamps: true});

const User = new mongoose.model("User", UserSchema);

module.exports = User;
