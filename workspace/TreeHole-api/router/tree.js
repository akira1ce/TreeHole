/*
 * @Author: Akira
 * @Date: 2022-11-09 11:08:56
 * @LastEditTime: 2023-02-20 16:50:50
 */
const express = require("express");
const treeCtrl = require("../controller/tree");

const router = express.Router();

/** 添加苗木 */
router.post("/addTree", treeCtrl.addTree);
/** 删除苗木 */
router.post("/removeById", treeCtrl.removeById);
/** 修改苗木 */
router.post("/modifyById", treeCtrl.modifyById);
/** 获取苗木列表 */
router.post("/getTreeList", treeCtrl.getTreeList);
/** 获取用户苗木列表 */
router.post("/getTreeListByUserID", treeCtrl.getTreeListByUserID);
/** 获取苗木集合列表 */
router.post("/getTreeListByID", treeCtrl.getTreeListByID);
/** 获取推荐苗木列表 */
router.post("/getRecommendTreeList", treeCtrl.getRecommendTreeList);
/** 获取地区苗木列表 */
router.post("/getAreaTreeList", treeCtrl.getAreaTreeList);
/** 获取苗木 */
router.post("/getTreeById", treeCtrl.getTreeById);

module.exports = router;
