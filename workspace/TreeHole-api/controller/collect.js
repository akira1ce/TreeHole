/*
 * @Author: Akira
 * @Date: 2023-04-11 23:37:04
 * @LastEditTime: 2023-04-11 23:52:33
 */
const { result, err } = require("../util");
const { Collect } = require("../model");

const addCollect = async (res, req, next) => {
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

const removeCollect = async (res, req, next) => {
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

const getCollectList = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const list = await Collect.find({ userID });
    res.send(result(200, { list }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

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
