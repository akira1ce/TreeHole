const mongoose = require("mongoose");
const Types = require("../util/schemaTypes");
const recordSchema = new mongoose.Schema({
  userID: {
    type: Types.String,
    required: true,
  },
  following: {
    type: Types.Array,
    required: false,
    default: [],
  },
  fans: {
    type: Types.Array,
    required: false,
    default: [],
  },
  collect: {
    type: Types.Array,
    required: false,
    default: [],
  },
  browsingHistory: {
    type: Types.Array,
    required: false,
    default: [],
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
