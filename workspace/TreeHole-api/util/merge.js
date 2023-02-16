const { Tree, User, Record, Order, Socket } = require("../model");

// mergexxx
const mergeComments = async (data) => {
  const comments = [];
  for (let i = 0; i < data.length; i++) {
    const comment = {};
    const item = data[i];
    Object.assign(comment, item._doc);
    comment.sender = await User.findOne({ _id: item.senderID }, { password: 0 });
    comments.push(comment);
  }
  return comments;
};

const mergeTrees = async (data) => {
  const trees = [];
  for (let i = 0; i < data.length; i++) {
    const tree = {};
    const item = data[i];
    Object.assign(tree, item._doc);
    tree.owner = await User.findOne({ _id: item.ownerID }, { password: 0 });
    trees.push(tree);
  }
  return trees;
};

const mergeRecord = async (data) => {
  const record = {};
  Object.assign(record, data._doc);
  return record;
};

const mergeOrders = async (data) => {
  const orders = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let order = {};
    Object.assign(order, item._doc);
    order.buyer = await User.findOne({ _id: item.buyerID }, { password: 0 });
    order.seller = await User.findOne({ _id: item.sellerID }, { password: 0 });
    orders.push(order);
  }
  return orders;
};

const mergeSockets = async (data, userID) => {
  const sockets = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const socket = {};
    Object.assign(socket, item._doc);
    socket.user1 = await User.findOne({ _id: item.userID1 }, { password: 0 });
    socket.user2 = await User.findOne({ _id: item.userID2 }, { password: 0 });
    sockets.push(socket);
  }
  return sockets;
};

module.exports = {
  mergeTrees,
  mergeRecord,
  mergeOrders,
  mergeSockets,
  mergeComments,
};
