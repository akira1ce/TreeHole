/*
 * @Author: Akira
 * @Date: 2022-11-05 10:11:34
 * @LastEditTime: 2023-04-11 23:12:45
 */
const mongoose = require("mongoose");
const { config } = require("../util");
const URL = config.url + config.dbName;
// connect
mongoose.connect(URL, {
  useNewUrlParser: true,
});

// connect success
mongoose.connection.on("connected", () => {
  console.log("mongoose connection success");
});

// connect error
mongoose.connection.on("error", (error) => {
  console.log(`mongoose connection error: ${error}`);
});

// disconnect
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});

module.exports = {
  User: mongoose.model("User", require("./User"), "User"),
  Tree: mongoose.model("Tree", require("./Tree"), "Tree"),
  Record: mongoose.model("Record", require("./Record"), "Record"),
  Order: mongoose.model("Order", require("./Order"), "Order"),
  Socket: mongoose.model("Socket", require("./Socket"), "Socket"),
  Comment: mongoose.model("Comment", require("./Comment"), "Comment"),
  SocketContent: mongoose.model("SocketContent", require("./SocketContent"), "SocketContent"),
  History: mongoose.model("History", require("./History"), "History"),
  Collect: mongoose.model("Collect", require("./Collect"), "Collect"),
  Follow: mongoose.model("Follow", require("./Follow"), "Follow"),
};
