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
  avator: {
    type: Types.String,
    required: false,
  },
  name: {
    type: Types.String,
    required: false,
  },
  sex: {
    type: Types.String,
    required: false,
  },
  location: {
    type: Types.String,
    required: false,
  },
});
module.exports = userSchema;
