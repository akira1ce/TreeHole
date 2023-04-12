/*
 * @Author: Akira
 * @Date: 2023-04-07 20:48:19
 * @LastEditTime: 2023-04-07 21:05:45
 */
const { SocketContent, Socket } = require("../model");
const { result, err } = require("../util");

/** 新增会话内容 */
const addSocketContent = async (req, res, next) => {
  try {
    const { socketID } = req.body;
    const socket = await Socket.findOne({ _id: socketID });

    /** 会话不存在 */
    if (!socket) {
      next(result(401, socket, "会话不存在！"));
      return;
    }

    const socketContent = new SocketContent(req.body);
    const content = await socketContent.save();

    res.send(result(200, content, "ok"));
  } catch (e) {
    next(err(e));
  }
};

/** 获取会话内容 */
const getSocketContentBySid = async (req, res, next) => {
  try {
    const { sid } = req.body;
    const list = await SocketContent.find({ socketID: sid });
    res.send(result(200, list, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addSocketContent,
  getSocketContentBySid,
};
