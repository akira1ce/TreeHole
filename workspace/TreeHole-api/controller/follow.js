/*
 * @Author: Akira
 * @Date: 2023-04-11 23:02:15
 * @LastEditTime: 2023-04-12 12:13:44
 */
const { result, err } = require("../util");
const { Follow } = require("../model");
const { mergeFollow } = require("../util/merge");

/** 关注 */
const addFollow = async (req, res, next) => {
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
/** 取消关注 */
const removeFollow = async (req, res, next) => {
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

/** 获取关注粉丝列表 */
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

/** 获取关注列表 */
const getFollowList = async (req, res, next) => {
  try {
    const { fromUserID, pageNo, limit } = req.body;
    const follow = await Follow.find({ fromUserID })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const list = await mergeFollow(follow);
    res.send(result(200, { list }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 获取粉丝列表 */
const getFansList = async (req, res, next) => {
  try {
    const { toUserID, pageNo, limit } = req.body;
    const fans = await Follow.find({ toUserID })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const list = await mergeFollow(fans);
    res.send(result(200, { list }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 是否关注 */
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
  getFansList,
  getFollowList,
  isFollow,
};
