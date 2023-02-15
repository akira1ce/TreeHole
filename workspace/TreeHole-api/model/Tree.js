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
  status: {
    type: Types.String,
    required: false,
    default: "0",
  },
  title: {
    type: Types.String,
    required: true,
    default: "",
  },
  time: {
    type: Types.String,
    required: false,
    default: new Date().toLocaleString(),
  },
  height: {
    type: Types.String,
    required: true,
    default: "",
  },
  diameter: {
    type: Types.String,
    required: true,
    default: "",
  },
  crownDiameter: {
    type: Types.String,
    required: true,
    default: "",
  },
  branchPoint: {
    type: Types.String,
    required: true,
    default: "",
  },
  hci: {
    type: Number,
    required: true,
    default: "",
  },
  location: {
    type: Types.String,
    required: true,
    default: "",
  },
  describe: {
    type: Types.String,
    required: true,
    default: "",
  },
  price: {
    type: Types.String,
    required: true,
    default: "",
  },
  imgs: {
    type: Types.Array,
    required: false,
    default: [],
  },
});
module.exports = treeSchema;
