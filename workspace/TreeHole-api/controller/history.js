/*
 * @Author: Akira
 * @Date: 2023-04-11 23:54:24
 * @LastEditTime: 2023-04-12 00:03:47
 */
const { result, err } = require("../util");
const { History } = require("../model");

const addHistory = async (res, req, next) => {
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

const removeAllHistory = async (res, req, next) => {
  try {
    const { userID } = req.body;
    const data = await History.deleteMany({ userID });
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

const getHistoryList = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const list = await History.find({ userID });
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
