/*
 * @Author: Akira
 * @Date: 2022-11-10 09:40:09
 * @LastEditTime: 2023-02-27 18:25:31
 */
const upload = require("../middleware/upload.js");
const { config, result } = require("../util");
const { database } = require("../util/database");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = config.url;

const baseUrl = "http://127.0.0.1:5000/uploadCenter/files/";

const mongoClient = new MongoClient(url);

// 上传文件
const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);

    // 文件为空
    if (req.file == undefined) {
      return res.status(400).send({ message: "请选择要上传的文件" });
    }
    return res.send(result(200, { name: req.file.filename, url: baseUrl + req.file.filename }, "ok"));
  } catch (error) {
    // 大小超限
    if (error.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "文件大小不能超过 5MB",
      });
    }

    return res.status(500).send({
      message: `无法上传文件:, ${error}`,
    });
  }
};

// 获取文件列表
const getListFiles = async (req, res) => {
  try {
    // await mongoClient.connect();
    // const database = mongoClient.db(config.database);
    const files = database.collection(config.filesBucket + ".files");

    // 文件数据信息
    let fileInfos = [];

    if ((await files.estimatedDocumentCount()) === 0) {
      fileInfos = [];
    }

    let cursor = files.find({});
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

// 下载
const download = async (req, res) => {
  try {
    const bucket = new GridFSBucket(database, {
      bucketName: config.filesBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);
    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "无法获取文件" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

// 删除
const remove = async (req, res) => {
  try {
    const { filename } = req.body;
    const bucket = new GridFSBucket(database, { bucketName: config.filesBucket });
    const files = database.collection(config.filesBucket + ".files");

    if (!filename || filename.length == 0) throw new Error("filename is null.");

    /** 级联删除 */
    if (filename instanceof Array) {
      const file = await files.find({ filename: { $in: filename } });
      if (file.length == 0) throw new Error("资源不存在");
      file.forEach(async (item) => {
        await bucket.delete(item._id);
      });
      res.send(result(200, null, "ok"));
    } else {
      /** 单个删除 */
      const file = await files.findOne({ filename });
      if (!file) throw new Error("资源不存在");
      const data = await bucket.delete(file._id);
      res.send(result(200, data, "ok"));
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message || error,
    });
  }
};
module.exports = {
  uploadFiles,
  getListFiles,
  download,
  remove,
};
