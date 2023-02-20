/*
 * @Author: Akira
 * @Date: 2022-11-05 10:53:00
 * @LastEditTime: 2023-02-20 16:46:29
 */
const { User, Record } = require("../model");
const { result, err, config } = require("../util");
const jwt = require("jsonwebtoken");

// 注册
const register = async (req, res, next) => {
  try {
    const { account } = req.body;
    let user = await User.findOne({ account });

    // 用户名已被占用
    if (user) {
      next(err("用户名已被占用", 403, ""));
      return;
    }

    user = new User(req.body);
    const data = await user.save();

    // 同步生成记录
    const record = new Record({ userID: data._id });
    await record.save();

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 登陆
const login = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const user = await User.findOne({ account });

    // 用户不存在
    if (!user) {
      next(err("用户不存在", 403, ""));
      return;
    }

    // 密码错误
    if (password !== user.password) {
      next(err("密码错误", 403, ""));
      return;
    }

    // token
    const token = jwt.sign({ user }, config.secretKey, { expiresIn: "12h" });
    user.password = undefined;
    const data = {
      token,
      user,
    };

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 删除
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await User.findByIdAndRemove(_id);

    // 用户不存在
    if (!data) {
      next(err("该用户不存在", 403, ""));
      return;
    }

    // 同步删除记录
    await Record.findOneAndRemove({ userID: _id });

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 修改
const modifyById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await User.findByIdAndUpdate(_id, req.body);

    // 用户不存在
    if (!data) {
      next(err("用户不存在", 403, ""));
      return;
    }

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询用户列表
const getUserList = async (req, res, next) => {
  try {
    const data = await User.find();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询用户集合列表
const getUserListByID = async (req, res, next) => {
  try {
    let { users, pageNo, limit } = req.body;
    users = users.slice((pageNo - 1) * limit, pageNo * limit);
    const data = await User.find({ _id: { $in: users } });
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询用户
const getUserById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await User.findOne({ _id }, { password: 0 });
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  register,
  login,
  removeById,
  modifyById,
  getUserList,
  getUserListByID,
  getUserById,
};
