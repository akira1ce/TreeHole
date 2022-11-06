const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const userSchema = new mongoose.Schema({
  account: {
    type: Types.String,
    required: true,
  },
  password: {
    type: Types.String,
    required: true,
  },
  role: {
    type: Types.String,
    required: true,
  },
  avator: {
    type: Types.String,
    required: false,
    default: "",
  },
  name: {
    type: Types.String,
    required: false,
    default: "",
  },
  sex: {
    type: Types.String,
    required: false,
    default: "",
  },
  location: {
    type: Types.String,
    required: false,
    default: "",
  },
});
module.exports = userSchema;
