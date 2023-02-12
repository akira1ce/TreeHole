const { Socket, User } = require("../model");
const { result, err } = require("../util");

const { mergeSockets } = require("../util/merge");

// addSocket
const addSocket = async (req, res, next) => {
  try {
    const { userID1, userID2, treeID } = req.body;
    let socket = await Socket.findOne({
      $or: [{ $and: [{ userID1 }, { userID2 }, { treeID }] }, { $and: [{ userID1: userID2 }, { userID2: userID1 }, { treeID }] }],
    });
    if (socket) {
      next(err("会话已存在", 200, ""));
      return;
    }
    socket = new Socket(req.body);
    const data = await socket.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// removeById
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await Socket.findByIdAndRemove(_id);
    if (!data) {
      next(err("The Socket does not exist", 403, ""));
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
    const { _id, msg } = req.body;
    const socket = await Socket.findOne({ _id });
    if (!socket) {
      next(err("The Socket does not exist", 403, ""));
      return;
    }
    socket.context.push(msg);
    const data = await Socket.findByIdAndUpdate(_id, socket);
    if (!data) {
      next(err("update socket error", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getSocketByUserID
const getSocketByUserID = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const data = await Socket.find({
      $or: [{ userID1: userID }, { userID2: userID }],
    });
    const sockets = await mergeSockets(data, userID);
    res.send(result(200, sockets, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addSocket,
  removeById,
  modifyById,
  getSocketByUserID,
};
