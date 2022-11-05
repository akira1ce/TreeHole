const { User } = require("../model");
const { sendBody } = require("../util");
// get user list
exports.getAll = async (req, res, next) => {
  try {
    console.log("[getAll]");
    let data = await User.find();
    res.send(sendBody(200, data, "getAll success!"));
  } catch (error) {
    res.send(sendBody(201,"","failed"));
    next(error);
  }
};
