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
    type: Types.String,
    required: false,
    default: new Date().toLocaleString(),
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
