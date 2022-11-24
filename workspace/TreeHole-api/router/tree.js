const express = require("express");
const treeCtrl = require("../controller/tree");

const router = express.Router();

// 添加
router.post("/addTree", treeCtrl.addTree);
// 删除
router.post("/removeById", treeCtrl.removeById);
// 修改
router.post("/modifyById", treeCtrl.modifyById);
// 获取树列表
router.get("/getTreeList", treeCtrl.getTreeList);
// 获取树
router.post("/getTreeById", treeCtrl.getTreeById);
// 获取所有者的树列表
router.post("/getTreeListByUserID", treeCtrl.getTreeListByUserID);
module.exports = router;
