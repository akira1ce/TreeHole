/*
 * @Author: Akira
 * @Date: 2022-11-12 09:24:46
 * @LastEditTime: 2023-03-01 10:36:21
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const orderSchema = new mongoose.Schema({
  treeID: {
    type: Types.String,
    required: true,
  },
  tree: {
    type: Object,
    require: true,
  },
  buyerID: {
    type: Types.String,
    required: true,
  },
  sellerID: {
    type: Types.String,
    required: true,
  },
  status: {
    type: Types.String,
    required: false,
    default: "0",
  },
  time: {
    type: Types.Date,
    required: false,
    default: new Date(),
  },
  payTime: {
    type: Types.String,
    required: false,
    default: "",
  },
  refer: {
    type: Types.Number,
    require: false,
    default: 2,
  },
});
module.exports = orderSchema;
