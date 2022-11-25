const { Order, User, Tree } = require("../model");
const { result, err } = require("../util");

const { mergeOrders } = require("../util/merge");

// getOrderList
const getOrderList = async (req, res, next) => {
  try {
    const data = await Order.find();
    const orders = await mergeOrders(data);
    console.log(`output->orders`, orders);
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
module.exports = {
  getOrderList,
  getOrderListByUserID,
  addOrder,
  removeById,
  modifyById,
};
