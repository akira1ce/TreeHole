/*
 * @Author: Akira
 * @Date: 2022-11-11 09:29:30
 * @LastEditTime: 2023-02-20 16:47:20
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const recordSchema = new mongoose.Schema({
  userID: {
    type: Types.String,
    required: true,
  },
  order: {
    type: Types.Array,
    require: false,
    default: [],
  },
  socket: {
    type: Types.Array,
    require: false,
    default: [],
  },
});
module.exports = recordSchema;
