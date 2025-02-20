/*
 * @Author: Akira
 * @Date: 2022-11-25 15:10:29
 * @LastEditTime: 2023-04-12 13:42:03
 */
const { Tree, User, Record, Order, Socket } = require("../model");

// mergexxx
const mergeComments = async (data) => {
  if (data.length == 0) return data;
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
  if (data.length == 0) return data;
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

const mergeOrders = async (data) => {
  if (data.length == 0) return data;
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

const mergeSockets = async (data) => {
  if (data.length == 0) return data;
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

const mergeFollow = async (data) => {
  if (data.length == 0) return data;
  const follows = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const follow = {};
    Object.assign(follow, item._doc);
    follow.fromUser = await User.findOne({ _id: item.fromUserID }, { password: 0 });
    follow.toUser = await User.findOne({ _id: item.toUserID }, { password: 0 });
    follows.push(follow);
  }
  return follows;
};

const mergeCollect = async (data) => {
  if (data.length == 0) return data;
  const collects = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const collect = {};
    Object.assign(collect, item._doc);
    collect.tree = await Tree.findOne({ _id: item.treeID });
    collect.tree = (await mergeTrees([collect.tree]))[0];
    collects.push(collect);
  }
  return collects;
};

const mergeHistory = async (data) => {
  if (data.length == 0) return data;
  const historys = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const history = {};
    Object.assign(history, item._doc);
    history.tree = await Tree.findOne({ _id: item.treeID });
    history.tree = (await mergeTrees([history.tree]))[0];
    historys.push(history);
  }
  return historys;
};

module.exports = {
  mergeTrees,
  mergeOrders,
  mergeSockets,
  mergeComments,
  mergeFollow,
  mergeCollect,
  mergeHistory,
};
