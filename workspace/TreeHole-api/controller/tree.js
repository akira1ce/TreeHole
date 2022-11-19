const { Tree } = require("../model");
const { result, err } = require("../util");

// addTree
const addTree = async (req, res, next) => {
  try {
    const tree = new Tree(req.body);
    const data = await tree.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// removeById
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await Tree.findByIdAndRemove(_id);
    if (!data) {
      next(err("The tree does not exist", 403, ""));
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
    const data = await Tree.findByIdAndUpdate(_id, req.body);
    if (!data) {
      next(err("The tree does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeList
const getTreeList = async (req, res, next) => {
  try {
    const data = await Tree.find();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeById
const getTreeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await Tree.findOne({ _id });
    if (!data) {
      next(err("The tree does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeListByOwnerID
const getTreeListByOwnerID = async (req, res, next) => {
  try {
    const { ownerID } = req.body;
    const data = await Tree.find({ ownerID });
    if (!data) {
      next(err("The owner does not has trees", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addTree,
  removeById,
  modifyById,
  getTreeList,
  getTreeById,
  getTreeListByOwnerID,
};
