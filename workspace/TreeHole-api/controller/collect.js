/*
 * @Author: Akira
 * @Date: 2023-04-11 23:37:04
 * @LastEditTime: 2023-04-12 09:47:46
 */
const { result, err } = require("../util");
const { Collect } = require("../model");
const { mergeCollect } = require("../util/merge");

/** 收藏 */
const addCollect = async (req, res, next) => {
  try {
    const { userID, treeID } = req.body;
    const collect = await Collect.findOne({ userID, treeID });
    if (collect) {
      res.send(result(401, collect, "已收藏该苗木！"));
      return;
    }
    const newCollect = new Collect(req.body);
    const data = await newCollect.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 取消收藏 */
const removeCollect = async (req, res, next) => {
  try {
    const { userID, treeID } = req.body;
    const collect = await Collect.findOne({ userID, treeID });
    if (!collect) {
      res.send(result(401, collect, "已取消收藏该苗木！"));
      return;
    }
    const data = await Collect.findOneAndRemove({ userID, treeID });
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 获取收藏列表 */
const getCollectList = async (req, res, next) => {
  try {
    const { userID, pageNo, limit } = req.body;
    const collect = await Collect.find({ userID })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const list = await mergeCollect(collect);
    res.send(result(200, { list }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 是否收藏 */
const isCollect = async (req, res, next) => {
  try {
    const { userID, treeID } = req.body;
    const collect = await Collect.findOne({ userID, treeID });
    let data = false;
    if (collect) data = true;
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addCollect,
  removeCollect,
  getCollectList,
  isCollect,
};
