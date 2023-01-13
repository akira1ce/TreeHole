const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const orderSchema = new mongoose.Schema({
  treeID: {
    type: Types.String,
    required: true,
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
    required: true,
  },
  time: {
    type: Types.String,
    required: true,
    default: "",
  },
});
module.exports = orderSchema;
