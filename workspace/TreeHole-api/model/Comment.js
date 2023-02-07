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
