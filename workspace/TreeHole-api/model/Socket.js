/*
 * @Author: Akira
 * @Date: 2022-11-13 15:09:12
 * @LastEditTime: 2023-02-20 16:47:25
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const socketSchema = new mongoose.Schema({
  userID1: {
    type: Types.String,
    required: true,
  },
  userID2: {
    type: Types.String,
    required: true,
  },
  context: {
    type: Types.Array,
    required: false,
    default: [],
    /**
     * {
     *    senderID: '',
     *    time: '',
     *    data: {
     *        type: '',
     *        content: ''
     *    }
     * }
     */
  },
  treeID: {
    type: Types.String,
    required: true,
  },
  tree: {
    type: Object,
    required: true,
  },
  refer: {
    type: Types.Number,
    require: false,
    default: 2,
  },
});
module.exports = socketSchema;
