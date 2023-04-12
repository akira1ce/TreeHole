/*
 * @Author: Akira
 * @Date: 2022-11-10 10:00:01
 * @LastEditTime: 2023-02-27 13:32:01
 */
const express = require("express");
const uploadCtrl = require("../controller/upload");
const multipart = require("connect-multiparty");
const multipartyMid = multipart();
const router = express.Router();

/** 上传 */
router.post("/upload", uploadCtrl.uploadFiles);
/** 获取 */
router.post("/files", uploadCtrl.getListFiles);
/** 删除 */
router.post("/remove", multipartyMid, uploadCtrl.remove);
/** 下载 */
router.get("/files/:name", uploadCtrl.download);

module.exports = router;
