const upload = require("../middleware/upload.js");
const { config } = require("../util");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = config.url;

const baseUrl = "http://127.0.0.1:5000/uploadCenter/files/";

const mongoClient = new MongoClient(url);

// 上传文件
const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    console.log(res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "请选择要上传的文件" });
    }
    return res.status(200).send({
      message: baseUrl + req.file.filename,
    });
  } catch (error) {
    console.log(error);
    if (error.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "文件大小不能超过 10MB",
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
    await mongoClient.connect();

    const database = mongoClient.db(config.database);
    const files = database.collection(config.filesBucket + ".files");
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
    await mongoClient.connect();
    const database = mongoClient.db(config.database);
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
module.exports = {
  uploadFiles,
  getListFiles,
  download,
};
