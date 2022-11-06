const { User } = require("../model");
const { result, config } = require("../util");
const jwt = require("jsonwebtoken");

// userList
const getUserList = async (req, res) => {
  try {
    const data = await User.find();
    res.send(result(200, data, "ok"));
  } catch (error) {
    res.send(result(204, "", error.toString()));
  }
};

// register
const register = async (req, res) => {
  try {
    const { account } = req.body;
    let user = await User.findOne({ account });
    if (user) throw new Error("account already exists");
    user = new User(req.body);
    const data = await user.save();
    res.send(result(200, data, "ok"));
  } catch (error) {
    res.send(result(204, "", error.toString()));
  }
};

// login
const login = async (req, res) => {
  try {
    const { account, password } = req.body;
    const user = await User.findOne({ account });
    if (!user) throw new Error("account does not exist");
    if (password !== user.password) throw new Error("password is incorrect");
    const token = jwt.sign({ user }, config.secretKey, { expiresIn: "30h" });
    const data = {
      token,
      user,
    };
    res.send(result(200, data, "ok"));
  } catch (error) {
    res.send(result(204, "", error.toString()));
  }
};

module.exports = {
  getUserList,
  register,
  login,
};
