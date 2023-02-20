/*
 * @Author: Akira
 * @Date: 2022-11-10 10:00:01
 * @LastEditTime: 2023-02-20 16:50:47
 */
const express = require("express");
const uploadCtrl = require("../controller/upload");

const router = express.Router();

// 上传
router.post("/upload", uploadCtrl.uploadFiles);
// 获取
router.post("/files", uploadCtrl.getListFiles);
// 下载
router.get("/files/:name", uploadCtrl.download);

module.exports = router;
