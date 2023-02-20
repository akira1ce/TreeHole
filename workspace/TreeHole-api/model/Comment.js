/*
 * @Author: Akira
 * @Date: 2023-02-07 11:47:15
 * @LastEditTime: 2023-02-20 16:47:13
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const commentSchema = new mongoose.Schema({
  treeID: {
    type: Types.String,
    required: true,
  },
  senderID: {
    type: Types.String,
    required: true,
  },
  context: {
    type: Types.String,
    required: true,
  },
  time: {
    type: Types.String,
    require: false,
    default: new Date().toLocaleString(),
  },
});
module.exports = commentSchema;
