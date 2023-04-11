/*
 * @Author: Akira
 * @Date: 2023-04-11 22:59:27
 * @LastEditTime: 2023-04-11 22:59:27
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const collectSchema = new mongoose.Schema({
  userID: {
    type: Types.String,
    required: true,
  },
  treeID: {
    type: Types.String,
    required: true,
  },
  time: {
    type: Types.String,
    require: false,
    default: new Date().toLocaleString(),
  },
});
module.exports = collectSchema;