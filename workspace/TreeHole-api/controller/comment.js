const { Comment } = require("../model");
const { result, err } = require("../util");
const { mergeComments } = require("../util/merge");

// getCommentByTreeID
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

// addComment
const addComment = async (req, res, next) => {
  try {
    const comment = new Comment(req.body);
    const data = await comment.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// removeById
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await Comment.findByIdAndRemove(_id);
    if (!data) {
      next(err("The Comment does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  getCommentByTreeID,
  removeById,
  addComment,
};
