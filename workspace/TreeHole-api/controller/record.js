const { Record, User, Tree } = require("../model");
const { result, err, config } = require("../util");

// getRecordByUserID
const getRecordByUserID = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const data = await Record.findOne({ userID });
    const record = {
      _id: data._id,
      userID: data.userID,
    };
    if (!data) {
      next(err("The userID does not exist", 403, ""));
      return;
    }
    record.following = await User.find({ _id: { $in: data.following } });
    record.fans = await User.find({ _id: { $in: data.fans } });
    record.browsingHistory = await Tree.find({
      _id: { $in: data.browsingHistory },
    });
    record.collect = await Tree.find({ _id: { $in: data.collect } });
    record.treeList = await Tree.find({ ownerID: userID });
    res.send(result(200, record, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// addRecord
/**
 * [userID]
 * [mode] index -> ["following", "fans", "collect", "browsingHistory"]
 * [id]
 */
const modifyRecord = async (req, res, next) => {
  try {
    const gather = ["following", "fans", "collect", "browsingHistory"];
    const { userID, mode, id } = req.body;
    if (mode == 0) {
      // following || fans
      // userID -> user1
      // id -> user2
      const records = await Record.find({
        userID: { $in: [userID, id] },
      });

      if (records == []) {
        next(err("The record does not exist", 403, ""));
        return;
      }
      const index = records[0].following.indexOf(id);
      if (index == -1) {
        records[0].following.push(id);
        records[1].fans.push(id);
      } else {
        records[0].following = records[0].following.filter((item) => item != id);
        records[1].fans = records[1].fans.filter((item) => item != userID);
      }
      // res.send(result(200, records, "ok"));
      // return;
      let res1 = await Record.findByIdAndUpdate(records[0]._id, records[0]);
      let res2 = await Record.findByIdAndUpdate(records[1]._id, records[1]);
      const data = [res1, res2];
      if (data == []) {
        next(err("Data update failed!", 403, ""));
        return;
      }
      res.send(result(200, data, "ok"));
    } else {
      // collect || browsingHistory
      // userID -> user
      // id -> treeID
      const record = await Record.find({ userID });
      if (!record) {
        next(err("The record does not exist", 403, ""));
        return;
      }
      if (mode == 3) record.browsingHistory.push(id);
      else {
        const index = record.collect.indexOf(id);
        if (index == -1) record.collect.push(id);
        else record.collect.splice(index, 1);
      }
      const data = await Record.findByIdAndUpdate(record._id, record);
      if (!data) {
        next(err("The _id does not exist", 403, ""));
        return;
      }
      res.send(result(200, data, "ok"));
    }
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  getRecordByUserID,
  modifyRecord,
};
