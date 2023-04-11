/*
 * @Author: Akira
 * @Date: 2023-04-11 23:02:15
 * @LastEditTime: 2023-04-11 23:37:08
 */
const { result, err } = require("../util");
const { Follow } = require("../model");

const addFollow = async (res, req, next) => {
  try {
    const { fromUserID, toUserID } = req.body;
    const follow = await Follow.findOne({ fromUserID, toUserID });
    if (follow) {
      res.send(result(401, follow, "已关注该用户！"));
      return;
    }
    const newFollow = new Follow(req.body);
    const data = await newFollow.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

const removeFollow = async (res, req, next) => {
  try {
    const { fromUserID, toUserID } = req.body;
    const follow = await Follow.findOne({ fromUserID, toUserID });
    if (!follow) {
      res.send(result(401, follow, "已取消关注该用户！"));
      return;
    }
    const data = await Follow.findOneAndRemove({ fromUserID, toUserID });
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

const getFollowCount = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const followCount = await Follow.find({ fromUserID: userID }).count();
    const fansCount = await Follow.find({ toUserID: userID }).count();
    res.send(result(200, { followCount, fansCount }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

const isFollow = async (req, res, next) => {
  try {
    const { fromUserID, toUserID } = req.body;
    const follow = await Follow.findOne({ fromUserID, toUserID });
    let data = false;
    if (follow) data = true;
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addFollow,
  removeFollow,
  getFollowCount,
  isFollow,
};
