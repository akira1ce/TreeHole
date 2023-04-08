/*
 * @Author: Akira
 * @Date: 2023-02-07 12:22:04
 * @LastEditTime: 2023-04-08 11:40:41
 */
const { Comment, Tree } = require("../model");
const { result, err } = require("../util");
const { mergeComments } = require("../util/merge");

// 增加评论
const addComment = async (req, res, next) => {
  try {
    const { treeID } = req.body;
    const tree = await Tree.findOne({ _id: treeID });
    if (!tree) {
      next(result(401, tree, "该苗木已被删除！"));
      return;
    }
    const comment = new Comment(req.body);
    const data = await comment.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 删除评论
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await Comment.findByIdAndRemove(_id);
    // 评论不存在
    if (!data) {
      next(err("该评论不存在", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// 查询苗木评论
const getCommentByTreeID = async (req, res, next) => {
  try {
    const { treeID, pageNo, limit } = req.body;
    const data = await Comment.find({ treeID })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const comments = await mergeComments(data);
    res.send(result(200, comments, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  getCommentByTreeID,
  removeById,
  addComment,
};
