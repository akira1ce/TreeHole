const { Tree, User, Comment } = require("../model");
const { result, err } = require("../util");

const { mergeTrees } = require("../util/merge");

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
    await Comment.deleteMany({ treeID: _id });
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
    const { pageNo, limit } = req.body;
    const data = await Tree.find()
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const trees = await mergeTrees(data);
    res.send(result(200, trees, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeById
const getTreeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await Tree.find({ _id });
    const trees = await mergeTrees(data);
    res.send(result(200, trees[0] || null, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeListByUserID
const getTreeListByUserID = async (req, res, next) => {
  try {
    const { userID, pageNo, limit } = req.body;
    const trees = await Tree.find({ ownerID: userID })
      .sort({ _id: -1 })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    if (!trees) {
      next(err("The userID does not has trees", 403, ""));
      return;
    }
    const treeList = await mergeTrees(trees);
    res.send(result(200, treeList, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeListByID
const getTreeListByID = async (req, res, next) => {
  try {
    let { trees, pageNo, limit } = req.body;
    trees = trees.slice((pageNo - 1) * limit, pageNo * limit);
    const data = await Tree.find({ _id: { $in: trees } });
    const treeList = await mergeTrees(data);
    res.send(result(200, treeList, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getRecommendTreeList
const getRecommendTreeList = async (req, res, next) => {
  try {
    let { trees, pageNo, limit } = req.body;
    let hci_gt = 0;
    let hci_lt = 5;
    if (trees.length != 0) {
      // 用户浏览记录前十条
      trees = trees.slice(0, 10);
      let data = await Tree.find({ _id: { $in: trees } });
      // 计算 hci
      let hci = 0;
      data.forEach((item) => {
        hci += item.hci;
      });
      hci = hci / data.length;
      // 上下浮动 hci
      hci_gt = (hci - 0.5).toFixed(2);
      hci_lt = (hci + 0.5).toFixed(2);
      // 出界特判
      if (hci_gt < 0) hci_gt = 0;
    }

    data = await Tree.find({ hci: { $gt: hci_gt, $lt: hci_lt } })
      .sort({ _id: -1 })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const treeList = await mergeTrees(data);
    res.send(result(200, treeList, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getAreaTreeList
const getAreaTreeList = async (req, res, next) => {
  try {
    const { area, pageNo, limit } = req.body;
    const re = new RegExp(`${area}`, "i");
    const data = await Tree.find({ location: re })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const trees = await mergeTrees(data);
    res.send(result(200, trees, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addTree,
  removeById,
  modifyById,
  getTreeById,
  getTreeList,
  getTreeListByUserID,
  getTreeListByID,
  getRecommendTreeList,
  getAreaTreeList,
};
