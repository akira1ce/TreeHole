/*
 * @Author: Akira
 * @Date: 2022-11-05 10:35:08
 * @LastEditTime: 2023-04-01 18:17:33
 */
const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const userSchema = new mongoose.Schema({
  account: {
    type: Types.String,
    required: true,
  },
  password: {
    type: Types.String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  avator: {
    type: Types.String,
    required: false,
    default: "https://s2.loli.net/2023/02/28/PtfNEqQHhxTcAbk.png",
  },
  name: {
    type: Types.String,
    required: false,
    default: "苗友12138",
  },
  sex: {
    type: String,
    required: false,
    default: 0,
  },
  location: {
    type: Types.String,
    required: false,
    default: "安徽省-铜陵市",
  },
  status: {
    type: String,
    require: false,
    default: 0,
  },
});
module.exports = userSchema;
