/*
 * @Author: Akira
 * @Date: 2022-11-11 09:35:44
 * @LastEditTime: 2023-02-20 16:34:52
 */
const { Record, Order, Socket } = require("../model");
const { result, err } = require("../util");

const { mergeRecord } = require("../util/merge");

// 获取用户记录
const getRecordByUserID = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const data = await Record.findOne({ userID });

    // 记录不存在
    if (!data) {
      next(err("记录不存在", 403, ""));
      return;
    }

    const record = await mergeRecord(data);
    res.send(result(200, record, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 修改用户关注、被关注记录

// following || fans 涉及 关注被关注双方 user1[主] user2[次]
const modifyRecordUser = async (req, res, next) => {
  try {
    const { userID1, userID2 } = req.body;
    const records = await Record.find({
      userID: { $in: [userID1, userID2] },
    });

    if (records.length != 2) {
      next(err("记录有误", 403, ""));
      return;
    }

    // 查询顺序矫正
    if (records[0].userID != userID1) records.reverse();

    const index_0 = records[0].following.indexOf(userID2);
    const index_1 = records[1].fans.indexOf(userID1);

    if (index_0 == -1) {
      // 关注
      records[0].following.unshift(userID2);
      records[1].fans.unshift(userID1);
    } else {
      // 取消关注
      records[0].following.splice(index_0, 1);
      records[1].fans.splice(index_1, 1);
    }

    // 更新记录
    let res1 = await Record.findByIdAndUpdate(records[0]._id, records[0]);
    let res2 = await Record.findByIdAndUpdate(records[1]._id, records[1]);

    const data = [res1, res2];

    // 更新失败
    if (data == []) {
      next(err("Data update failed!", 403, ""));
      return;
    }

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 修改用户苗木记录
// { userID, treeID, mode, clearAll }
// mode: [0, 1] -> [browsingHistory, collect]
const modifyRecordTree = async (req, res, next) => {
  try {
    const { userID, treeID, mode, clearAll } = req.body;

    const record = await Record.findOne({ userID });

    // 记录不存在
    if (!record) {
      next(err("该记录不存在", 403, ""));
      return;
    }

    if (mode == 0) {
      // 浏览记录
      const index = record.browsingHistory.indexOf(treeID);
      // 清空历史记录
      if (clearAll == 1) record.browsingHistory = [];
      else if (index == -1) record.browsingHistory.unshift(treeID);
    } else {
      // 收藏
      const index = record.collect.indexOf(treeID);
      if (index == -1) record.collect.unshift(treeID);
      else record.collect.splice(index, 1);
    }

    const data = await Record.findByIdAndUpdate(record._id, record);

    // 更新失败
    if (!data) {
      next(err("The _id does not exist", 403, ""));
      return;
    }

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 修改用户订单记录
const modifyRecordOrder = async (req, res, next) => {
  try {
    const { userID, orderID } = req.body;
    const record = await Record.findOne({ userID });

    // 记录不存在
    if (!record) {
      next(err("该记录不存在", 403, ""));
      return;
    }

    const index = record.order.indexOf(orderID);
    let data = null;

    // 订单记录存在
    if (index != -1) {
      // 更新记录
      record.order.splice(index, 1);
      data = await Record.findByIdAndUpdate(record._id, record);

      // 更新订单引用数
      const order = await Order.findOne({ _id: orderID });
      const refer = --order.refer;

      // 更新订单 引用为0 删除订单
      if (refer != 0) await Order.findByIdAndUpdate(orderID, { refer });
      else await Order.findByIdAndDelete(orderID);
    }

    res.send(result(200, data, "订单删除成功"));
  } catch (e) {
    next(err(e));
  }
};

// 修改会话记录
const modifyRecordSocket = async (req, res, next) => {
  try {
    const { userID, socketID } = req.body;
    const record = await Record.findOne({ userID });

    // 记录不存在
    if (!record) {
      next(err("该记录不存在", 403, ""));
      return;
    }

    const index = record.socket.indexOf(socketID);
    let data = null;

    // 会话记录存在
    if (index != -1) {
      // 更新记录
      record.socket.splice(index, 1);
      data = await Record.findByIdAndUpdate(record._id, record);

      // 更新订单引用数
      const socket = await Socket.findOne({ _id: socketID });
      const refer = --socket.refer;
      if (refer != 0) await Socket.findByIdAndUpdate(socketID, { refer });
      else await Socket.findByIdAndDelete(socketID);
    }

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 修改
const modifyByID = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await Record.findByIdAndUpdate(_id, req.body);

    // 记录不存在
    if (!data) {
      next(err("该记录不存在", 403, ""));
      return;
    }

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  modifyRecordUser,
  modifyRecordTree,
  modifyRecordOrder,
  modifyRecordSocket,
  modifyByID,
  getRecordByUserID,
};
