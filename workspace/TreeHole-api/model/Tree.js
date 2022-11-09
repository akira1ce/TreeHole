const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const treeSchema = new mongoose.Schema({
  ownerID: {
    type: Types.String,
    required: true,
  },
  type: {
    type: Types.String,
    required: true,
  },
  height: {
    type: Types.String,
    required: false,
  },
  diameter: {
    type: Types.String,
    required: false,
  },
  branchPoint: {
    type: Types.String,
    required: false,
  },
  location: {
    type: Types.String,
    required: false,
    default: "",
  },
  describe: {
    type: Types.String,
    required: false,
    default: "",
  },
  price: {
    type: Types.String,
    required: false,
    default: "",
  },
  state: {
    type: Types.String,
    required: false,
    default: "",
  },
  imgs: {
    type: Types.Array,
    required: false,
    default: "",
  },
});
module.exports = treeSchema;
