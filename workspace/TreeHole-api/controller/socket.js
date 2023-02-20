const { Socket, User, Record } = require("../model");
const { result, err } = require("../util");

const { mergeSockets } = require("../util/merge");

/**
 * 伴随数据 添加 socket -> record
 * @param {Object} data  socketData
 */
const companionSocket = async (data) => {
  const { userID1, userID2 } = data;
  // 此处不需要考虑顺序
  const records = await Record.find({ userID: { $in: [userID1, userID2] } });

  // 新增同步
  records[0].socket.unshift(data._id.toString());
  records[1].socket.unshift(data._id.toString());

  await Record.findByIdAndUpdate(records[0]._id, records[0]);
  await Record.findByIdAndUpdate(records[1]._id, records[1]);
};

// 新增对话
const addSocket = async (req, res, next) => {
  try {
    const { userID1, userID2, treeID } = req.body;
    let socket = await Socket.findOne({ $or: [{ $and: [{ userID1 }, { userID2 }, { treeID }] }, { $and: [{ userID1: userID2 }, { userID2: userID1 }, { treeID }] }] });

    // 会话已存在
    if (socket) {
      // 会话引用数不足2
      if (socket.refer != 2) {
        // 获取会话成员的记录
        const records = await Record.find({ userID: { $in: [userID1, userID2] } });
        const index_0 = records[0].socket.indexOf(socket._id);
        const index_1 = records[1].socket.indexOf(socket._id);

        // 同步删除记录
        if (index_0 != -1) records[0].socket.splice(index_0, 1);
        if (index_1 != -1) records[1].socket.splice(index_1, 1);

        // 同步新增记录
        records[0].socket.unshift(socket._id.toString());
        records[1].socket.unshift(socket._id.toString());

        // 更新记录
        await Record.findByIdAndUpdate(records[0]._id, records[0]);
        await Record.findByIdAndUpdate(records[1]._id, records[1]);
        
        // 更新会话
        socket.refer = 2;
        await Socket.findByIdAndUpdate(socket._id, { refer: 2 });
      }
      res.send(result(200, socket, "ok"));
    } else {
      // 会话不存在
      socket = new Socket(req.body);
      const data = await socket.save();
      // 级联新增记录
      await companionSocket(data);
      res.send(result(200, data, "ok"));
    }
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
    if (msg) socket.context.push(msg);
    const data = await Socket.findByIdAndUpdate(_id, socket);
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

// getSocketListByID
const getSocketListByID = async (req, res, next) => {
  try {
    let { sockets, pageNo, limit } = req.body;
    sockets = sockets.slice((pageNo - 1) * limit, pageNo * limit);
    let data = null;
    data = await Socket.find({ _id: { $in: sockets } });
    data = await mergeSockets(data);
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addSocket,
  removeById,
  modifyById,
  getSocketByUserID,
  getSocketListByID,
};
