const express = require("express");
const multipart = require("connect-multiparty");
const treeCtrl = require("../controller/tree");

const multipartyMid = multipart();
const router = express.Router();

// 添加
router.post("/addTree", multipartyMid, treeCtrl.addTree);
// 删除
router.post("/removeById", multipartyMid, treeCtrl.removeById);
// 修改
router.post("/modifyById", multipartyMid, treeCtrl.modifyById);
// 获取树列表
router.get("/getTreeList", multipartyMid, treeCtrl.getTreeList);
// 获取树
router.post("/getTreeById", multipartyMid, treeCtrl.getTreeById);

module.exports = router;
