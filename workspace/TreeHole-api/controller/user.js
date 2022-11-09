const { User } = require("../model");
const { result, err, config } = require("../util");
const jwt = require("jsonwebtoken");

// userList
const getUserList = async (req, res, next) => {
  try {
    const data = await User.find();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// register
const register = async (req, res, next) => {
  try {
    const { account } = req.body;
    let user = await User.findOne({ account });
    if (user) {
      next(err("account already exists", 403, ""));
      return;
    }
    user = new User(req.body);
    const data = await user.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// login
const login = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const user = await User.findOne({ account });

    if (!user) {
      next(err("account does not exist", 403, ""));
      return;
    }
    if (password !== user.password) {
      next(err("password is incorrect", 403, ""));
      return;
    }

    // token
    const token = jwt.sign({ user }, config.secretKey, { expiresIn: "12h" });
    const data = {
      token,
      user,
    };

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// remove
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await User.findByIdAndRemove(_id);
    if (!data) {
      next(err("account does not exist", 403, ""));
      return;
    }
    res.send({ code: 200, data, message: "ok" });
  } catch (e) {
    next(err(e));
  }
};

// modify
const modifyById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await User.findByIdAndUpdate(_id, req.body);
    if (!data) {
      next(err("account does not exist", 403, ""));
      return;
    }
    res.send({ code: 200, data, message: "ok" });
  } catch (e) {
    next(err(e));
  }
};
module.exports = {
  getUserList,
  register,
  login,
  removeById,
  modifyById,
};
