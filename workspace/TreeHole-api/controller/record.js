const { Record, User, Tree } = require("../model");
const { result, err, config } = require("../util");

const { mergeRecord } = require("../util/merge");

// getRecordByUserID
const getRecordByUserID = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const data = await Record.findOne({ userID });
    if (!data) {
      next(err("The userID does not exist", 403, ""));
      return;
    }
    const record = await mergeRecord(data);
    res.send(result(200, record, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// modifyRecord

// modifyRecordUser
// following || fans 涉及 关注被关注双方 user1[主] user2[次]
const modifyRecordUser = async (req, res, next) => {
  try {
    const { userID1, userID2 } = req.body;
    const records = await Record.find({
      userID: { $in: [userID1, userID2] },
    });

    if (records == []) {
      next(err("The record does not exist", 403, ""));
      return;
    }

    const index = records[0].following.indexOf(userID2);
    if (index == -1) {
      // not exist -> follow
      records[0].following.push(userID2);
      records[1].fans.push(userID1);
    } else {
      // exist -> unFollow
      records[0].following = records[0].following.filter((item) => item != userID2);
      records[1].fans = records[1].fans.filter((item) => item != userID1);
    }
    // update record of user1 and user2
    let res1 = await Record.findByIdAndUpdate(records[0]._id, records[0]);
    let res2 = await Record.findByIdAndUpdate(records[1]._id, records[1]);
    const data = [res1, res2];
    if (data == []) {
      next(err("Data update failed!", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// modifyRecordTree
// { userID, treeID, mode, clearAll }
// mode: [0, 1] -> [browsingHistory, collect]
const modifyRecordTree = async (req, res, next) => {
  try {
    const { userID, treeID, mode, clearAll } = req.body;

    const record = await Record.findOne({ userID });
    if (!record) {
      next(err("The record does not exist", 403, ""));
      return;
    }

    if (mode == 0) {
      // browsingHistory
      const index = record.browsingHistory.indexOf(treeID);
      // 清空历史记录
      if (clearAll == 1) record.browsingHistory = [];
      else if (index == -1) record.browsingHistory.push(treeID);
    } else {
      // collect
      const index = record.collect.indexOf(treeID);
      if (index == -1) record.collect.push(treeID);
      else record.collect.splice(index, 1);
    }
    const data = await Record.findByIdAndUpdate(record._id, record);

    if (!data) {
      next(err("The _id does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// modifyRecordOrder
const modifyRecordOrder = async (req, res, next) => {
  try {
    const { userID, orderID } = req.body;
    const record = await Record.findOne({ userID });
    if (!record) {
      next(err("The record does not exist", 403, ""));
      return;
    }

    const index = record.order.indexOf(orderID);
    if (index != -1) record.order.splice(index, 1);

    const data = await Record.findByIdAndUpdate(record._id, record);
    if (!data) {
      next(err("The _id does not exist", 403, ""));
      return;
    }

    res.send(result(200, data, "Delete order success !"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  getRecordByUserID,
  modifyRecordUser,
  modifyRecordTree,
  modifyRecordOrder,
};
