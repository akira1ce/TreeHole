/*
 * @Author: Akira
 * @Date: 2022-11-05 10:35:08
 * @LastEditTime: 2023-02-20 16:47:29
 */
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
