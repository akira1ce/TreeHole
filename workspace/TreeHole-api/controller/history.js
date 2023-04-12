/*
 * @Author: Akira
 * @Date: 2023-04-11 23:54:24
 * @LastEditTime: 2023-04-12 12:11:55
 */
const { result, err } = require("../util");
const { History } = require("../model");
const { mergeHistory } = require("../util/merge");

/** 浏览记录 */
const addHistory = async (req, res, next) => {
  try {
    const { userID, treeID } = req.body;
    const history = await History.findOne({ userID, treeID });
    if (history) {
      res.send(result(200, history, "ok"));
      return;
    }
    const newHistory = new History(req.body);
    const data = await newHistory.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 清空浏览记录 */
const removeAllHistory = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const data = await History.deleteMany({ userID });
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 获取浏览记录列表 */
const getHistoryList = async (req, res, next) => {
  try {
    const { userID, pageNo, limit } = req.body;
    const history = await History.find({ userID })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const list = await mergeHistory(history);
    res.send(result(200, { list }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addHistory,
  removeAllHistory,
  getHistoryList,
};
