import api from "../api";
import request from "../api/request";
import { ElMessage } from "element-plus";

const local = {
  getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  clear() {
    localStorage.clear();
  },
};

const defaultState = {
  record: {
    _id: "",
    current: 0,
    browsingHistory: [],
    historyList: [],
    collect: [],
    collectList: [],
    fans: [],
    fansList: [],
    following: [],
    followList: [],
    order: [],
    treeList: [],
    orderList: [],
    userID: "",
  },
};

const recordHandle = {
  collect: async (record, user, tree) => {
    const userID = user._id;
    const treeID = tree._id;
    const index = record.collect.indexOf(treeID);
    const params = {
      userID,
      treeID,
      mode: 1,
    };
    await request.post(api.record.modifyRecordTree, params);
    if (index == -1) {
      record.collect.push(treeID);
      record.collectList.push(tree);
      ElMessage.success("收藏成功");
    } else {
      record.collect.splice(index, 1);
      record.collectList.splice(index, 1);
      ElMessage.success("取消收藏成功");
    }
  },
};

export { local, defaultState, recordHandle };
