/*
 * @Author: Akira
 * @Date: 2023-04-07 18:19:19
 * @LastEditTime: 2023-04-07 23:08:13
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const socketContentSchema = new mongoose.Schema({
  socketID: {
    type: Types.String,
    required: true,
  },
  senderID: {
    type: Types.String,
    require: true,
  },
  type: {
    type: Types.String,
    required: true,
  },
  context: {
    type: Types.String,
    required: true,
  },
  time: {
    type: Types.String,
    required: false,
    default: new Date().toLocaleString(),
  },
});
module.exports = socketContentSchema;
