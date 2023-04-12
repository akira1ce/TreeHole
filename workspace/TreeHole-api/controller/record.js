/*
 * @Author: Akira
 * @Date: 2022-11-11 09:35:44
 * @LastEditTime: 2023-04-07 23:11:49
 */
const { Record, Order, Socket, SocketContent } = require("../model");
const { result, err } = require("../util");

/** 获取用户记录 */
const getRecordByUserID = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const record = await Record.findOne({ userID });

    /** 记录不存在 */
    if (!record) {
      next(err("记录不存在", 403, ""));
      return;
    }
    res.send(result(200, record, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 修改用户订单记录 */
const modifyRecordOrder = async (req, res, next) => {
  try {
    const { userID, orderID } = req.body;
    const record = await Record.findOne({ userID });

    /** 记录不存在 */
    if (!record) {
      next(err("该记录不存在", 403, ""));
      return;
    }

    const index = record.order.indexOf(orderID);
    let data = null;

    /** 订单记录存在 */
    if (index != -1) {
      // 更新记录
      record.order.splice(index, 1);
      data = await Record.findByIdAndUpdate(record._id, record);

      /** 更新订单引用数 */
      const order = await Order.findOne({ _id: orderID });
      const refer = --order.refer;

      /** 更新订单 引用为0 删除订单 */
      if (refer != 0) await Order.findByIdAndUpdate(orderID, { refer });
      else await Order.findByIdAndDelete(orderID);
    }

    res.send(result(200, data, "订单删除成功"));
  } catch (e) {
    next(err(e));
  }
};

/** 修改会话记录 */
const modifyRecordSocket = async (req, res, next) => {
  try {
    const { userID, socketID } = req.body;
    const record = await Record.findOne({ userID });

    /** 记录不存在 */
    if (!record) {
      next(err("该记录不存在", 403, ""));
      return;
    }

    const index = record.socket.indexOf(socketID);
    let data = null;

    /** 会话记录存在 */
    if (index != -1) {
      // 更新记录
      record.socket.splice(index, 1);
      data = await Record.findByIdAndUpdate(record._id, record);

      /** 更新订单引用数 */
      const socket = await Socket.findOne({ _id: socketID });
      const refer = --socket.refer;
      if (refer != 0) await Socket.findByIdAndUpdate(socketID, { refer });
      else {
        await Socket.findByIdAndDelete(socketID);
        await SocketContent.deleteMany({ socketID });
      }
    }

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 修改 */
const modifyByID = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await Record.findByIdAndUpdate(_id, req.body);

    /** 记录不存在 */
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
  modifyRecordOrder,
  modifyRecordSocket,
  modifyByID,
  getRecordByUserID,
};
