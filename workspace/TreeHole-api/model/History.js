/*
 * @Author: Akira
 * @Date: 2023-04-11 23:01:25
 * @LastEditTime: 2023-04-11 23:01:25
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const historySchema = new mongoose.Schema({
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
module.exports = historySchema;