/*
 * @Author: Akira
 * @Date: 2022-11-09 10:39:02
 * @LastEditTime: 2023-04-01 15:58:54
 */
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
    default: "-1",
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
    required: false,
    default: "大哥什么也没有多说！",
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
  count: {
    type: Types.Number,
    require: false,
    default: 1,
  },
});
module.exports = treeSchema;
