const mongoose = require("mongoose");
const ip = "localhost";
const port = 27017;
const dbName = "TreeHoles";

// connect
mongoose.connect(`mongodb://${ip}:${port}/${dbName}`, {
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
};