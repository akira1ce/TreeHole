const { Record } = require("../model");
const { result, err, config } = require("../util");

// getRecordByUserID
const getRecordByUserID = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const data = await Record.findOne({ userID });
    if (!data) {
      next(err("The userID does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
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
    const record = await Record.findOne({ userID });

    if (!record) {
      next(err("The record does not exist", 403, ""));
      return;
    }

    const index = record[gather[mode]].indexOf(id);
    if (index == -1) record[gather[mode]].push(id);
    else if (mode != 3) record[gather[mode]].splice(index, 1);

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

module.exports = {
  getRecordByUserID,
  modifyRecord,
};
