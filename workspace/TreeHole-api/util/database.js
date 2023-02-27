/*
 * @Author: Akira
 * @Date: 2023-02-27 17:35:19
 * @LastEditTime: 2023-02-27 17:40:31
 */
const { config, result } = require("../util");

const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(config.url);

(async () => {
  await mongoClient.connect();
})();

const database = mongoClient.db(config.database);

module.exports = {
  database,
};
