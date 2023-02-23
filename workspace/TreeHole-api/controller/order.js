/*
 * @Author: Akira
 * @Date: 2022-11-12 09:29:52
 * @LastEditTime: 2023-02-20 16:22:51
 */
const { Order, User, Tree, Record } = require("../model");
const { result, err } = require("../util");

const { mergeOrders } = require("../util/merge");

// 同步更新记录
const companionOrder = async (data) => {
  const userID1 = data.buyerID;
  const userID2 = data.sellerID;
  const records = await Record.find({ userID: { $in: [userID1, userID2] } });

  const index_0 = records[0].order.indexOf(data._id);
  const index_1 = records[1].order.indexOf(data._id);

  if (index_0 == -1) {
    records[0].order.unshift(data._id.toString());
    records[1].order.unshift(data._id.toString());
  } else {
    records[0].order.splice(index_0, 1);
    records[1].order.splice(index_1, 1);
  }

  await Record.findByIdAndUpdate(records[0]._id, records[0]);
  await Record.findByIdAndUpdate(records[1]._id, records[1]);
};

// 增加订单
const addOrder = async (req, res, next) => {
  try {
    const { treeID } = req.body;
    let tree = await Tree.findOne({ _id: treeID });

    // 苗木不存在
    if (!tree) {
      next(err("该苗木已被删除", 403, ""));
      return;
    }

    let order = await Order.findOne({ treeID });

    // 苗木已被购买
    if (order) {
      next(err("该苗木已被购买", 403, ""));
      return;
    }

    order = new Order(req.body);
    const data = await order.save();
    await companionOrder(data);

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 删除订单
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await Order.findByIdAndRemove(_id);

    // 订单不存在
    if (!data) {
      next(err("订单不存在", 403, ""));
      return;
    }

    // 同步更新记录
    await companionOrder(data);

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 修改订单
const modifyById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await Order.findByIdAndUpdate(_id, req.body);

    // 订单不存在
    if (!data) {
      next(err("The order does not exist", 403, ""));
      return;
    }

    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 修改订单
const modifyByTreeID = async (req, res, next) => {
  try {
    const { treeID, state } = req.body;
    const order = await Order.findOne({ treeID });

    // 订单不存在
    if (!order) {
      next(err("订单不存在", 403, ""));
      return;
    }

    const data = await Order.findByIdAndUpdate(order._id, { state });
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询订单列表
const getOrderList = async (req, res, next) => {
  try {
    const { pageNo, limit } = req.body;
    const data = await Promise.all([
      Order.count(),
      Order.find()
        .skip((pageNo - 1) * limit)
        .limit(limit),
    ]);
    data[1] = await mergeOrders(data[1]);
    res.send(result(200, { count: data[0], list: data[1] }, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询用户订单列表
const getOrderListByUserID = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const data = await Order.find({
      $or: [{ buyerID: userID }, { sellerID: userID }],
    });
    const orders = await mergeOrders(data);
    res.send(result(200, orders, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询订单集合列表
const getOrderListByID = async (req, res, next) => {
  try {
    let { orders, pageNo, limit } = req.body;
    orders = orders.slice((pageNo - 1) * limit, pageNo * limit);
    const data = await mergeOrders(await Order.find({ _id: { $in: orders } }));
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询苗木订单
const getOrderByTreeID = async (req, res, next) => {
  try {
    const { treeID } = req.body;
    let order = await Order.findOne({ treeID });
    const orders = await mergeOrders([order]);
    order = orders[0];
    res.send(result(200, order, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addOrder,
  removeById,
  modifyById,
  modifyByTreeID,
  getOrderList,
  getOrderListByUserID,
  getOrderListByID,
  getOrderByTreeID,
};
