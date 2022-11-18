const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const treeSchema = new mongoose.Schema({
  ownerID: {
    type: Types.String,
    required: true,
  },
  owner: {
    type: Types.String,
    required: true,
  },
  type: {
    type: Types.String,
    required: true,
  },
  state: {
    type: Types.String,
    required: true,
    default: "",
  },
  title: {
    type: Types.String,
    required: true,
    default: "",
  },
  time: {
    type: Types.String,
    required: true,
    default: "",
  },
  height: {
    type: Types.String,
    required: false,
    default: "",
  },
  diameter: {
    type: Types.String,
    required: false,
    default: "",
  },
  branchPoint: {
    type: Types.String,
    required: false,
    default: "",
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
  imgs: {
    type: Types.Array,
    required: false,
    default: [],
  },
});
module.exports = treeSchema;
