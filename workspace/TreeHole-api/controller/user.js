/*
 * @Author: Akira
 * @Date: 2022-11-05 10:53:00
 * @LastEditTime: 2023-02-23 18:01:06
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
      next(err("用户名已被占用", 403, null));
      return;
    }

    user = new User(req.body);
    user = await user.save();

    // 同步生成记录
    const record = new Record({ userID: user._id });
    await record.save();

    res.send(result(200, { user }, "ok"));
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
      next(err("用户不存在", 403, null));
      return;
    }

    // 密码错误
    if (password !== user.password) {
      next(err("密码错误", 403, null));
      return;
    }

    // token
    const token = jwt.sign({ user }, config.secretKey, { expiresIn: "12h" });
    user.password = undefined;

    res.send(result(200, { token, user }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 删除
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let user = await User.findByIdAndDelete(_id, { select: { password: 0 } });

    // 用户不存在
    if (!user) {
      next(err("该用户不存在", 403, null));
      return;
    }

    // 同步删除记录
    await Record.findOneAndDelete({ userID: _id });

    res.send(result(200, { user }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 修改
const modifyById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const user = await User.findByIdAndUpdate(_id, req.body, { select: { password: 0 } });

    // 用户不存在
    if (!user) {
      next(err("用户不存在", 403, null));
      return;
    }

    res.send(result(200, { user }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询用户列表
const getUserList = async (req, res, next) => {
  try {
    let { pageNo, limit, account, name } = req.body;
    const re_account = new RegExp(account, "i");
    const re_name = new RegExp(name, "i");
    const data = await Promise.all([
      User.count(),
      User.find({ account: re_account, name: re_name })
        .skip((pageNo - 1) * limit)
        .limit(limit),
    ]);
    res.send(result(200, { count: data[0], list: data[1] }, "ok"));
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
