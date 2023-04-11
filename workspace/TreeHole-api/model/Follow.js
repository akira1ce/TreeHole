/*
 * @Author: Akira
 * @Date: 2023-04-11 22:54:50
 * @LastEditTime: 2023-04-11 22:54:55
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const followSchema = new mongoose.Schema({
  fromUserID: {
    type: Types.String,
    required: true,
  },
  toUserID: {
    type: Types.String,
    required: true,
  },
  time: {
    type: Types.String,
    require: false,
    default: new Date().toLocaleString(),
  },
});
module.exports = followSchema;