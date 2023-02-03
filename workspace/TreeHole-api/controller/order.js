const { Order, User, Tree, Record } = require("../model");
const { result, err } = require("../util");

const { mergeOrders } = require("../util/merge");

const companionOrder = async (data) => {
  const userID1 = data.buyerID;
  const userID2 = data.sellerID;
  const records = await Record.find({ userID: { $in: [userID1, userID2] } });
  const index = records[0].order.indexOf(data._id);
  if (index == -1) {
    records[0].order.push(data._id.toString());
    records[1].order.push(data._id.toString());
  } else {
    records[0].order.splice(index, 1);
    records[1].order.splice(index, 1);
  }
  await Record.findByIdAndUpdate(records[0]._id, records[0]);
  await Record.findByIdAndUpdate(records[1]._id, records[1]);
};

// getOrderList
const getOrderList = async (req, res, next) => {
  try {
    const data = await Order.find();
    const orders = await mergeOrders(data);
    res.send(result(200, orders, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getOrderListByUserID
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

// getOrderListByID
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

// addOrder
const addOrder = async (req, res, next) => {
  try {
    const { treeID } = req.body;
    let order = await Order.findOne({ treeID });
    if (order) {
      next(err("The tree has been purchased", 403, ""));
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

// removeById
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await Order.findByIdAndRemove(_id);
    await companionOrder(data);
    if (!data) {
      next(err("The order does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// modifyById
const modifyById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await Order.findByIdAndUpdate(_id, req.body);
    if (!data) {
      next(err("The order does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// modifyByTreeID
const modifyByTreeID = async (req, res, next) => {
  try {
    const { treeID, state } = req.body;
    const order = await Order.findOne({ treeID });
    if (!order) {
      next(err("The order does not exist", 403, ""));
      return;
    }
    const data = await Order.findByIdAndUpdate(order._id, { state });
    if (!data) {
      next(err("update order error", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};
module.exports = {
  getOrderList,
  getOrderListByUserID,
  getOrderListByID,
  getOrderByTreeID,
  addOrder,
  removeById,
  modifyById,
  modifyByTreeID,
};
