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
    userID: "",
    browsingHistory: [],
    collect: [],
    fans: [],
    following: [],
    order: [],
  },
  tree: {
    _id: "",
    ownerID: local.getItem("user")?._id || "",
    type: "",
    height: "",
    diameter: "",
    branchPoint: "",
    location: "",
    describe: "",
    imgs: [],
    price: "",
    state: "0",
    time: "",
    title: "",
  },
  order: {
    _id: "",
    treeID: "",
    buyerID: "",
    sellerID: "",
    status: "",
    time: "",
    buyer: {
      _id: "",
      account: "",
      name: "",
      sex: "",
      location: "",
      avator: "",
      role: "",
    },
    seller: {
      _id: "",
      account: "",
      name: "",
      sex: "",
      location: "",
      avator: "",
      role: "",
    },
    tree: {
      _id: "",
      ownerID: "",
      type: "",
      state: "",
      height: "",
      diameter: "",
      branchPoint: "",
      location: "",
      describe: "",
      price: "",
      imgs: [],
      time: "",
      title: "",
    },
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
      ElMessage.warning("收藏成功");
    } else {
      record.collect.splice(index, 1);
      ElMessage.warning("取消收藏成功");
    }
  },
};

const tools = {
  timeFormat: (time) => {
    const timeArr = time.split(" ");
    let timeArr_0 = timeArr[0].split("-");
    let timeArr_1 = timeArr[1];


    if (timeArr_0[1] < "10") timeArr_0[1] = timeArr_0[1].slice(1);
    if (timeArr_0[2] < "10") timeArr_0[1] = timeArr_0[2].slice(1);

    timeArr_0 = timeArr_0.join("/");

    return `${timeArr_0} ${timeArr_1}`;
  },
};

export { local, defaultState, recordHandle, tools };
