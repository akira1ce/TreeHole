/*
 * @Author: Akira
 * @Date: 2023-02-07 13:01:57
 * @LastEditTime: 2023-02-20 16:47:47
 */
const express = require("express");
const commentCtrl = require("../controller/comment");

const router = express.Router();

/** 增加评论 */
router.post("/addComment", commentCtrl.addComment);
/** 删除评论 */
router.post("/removeById", commentCtrl.removeById);
/** 查询苗木评论 */
router.post("/getCommentByTreeID", commentCtrl.getCommentByTreeID);

module.exports = router;
