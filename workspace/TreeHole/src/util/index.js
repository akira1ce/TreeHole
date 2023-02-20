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
  comment: {
    treeID: "",
    senderID: "",
    context: "",
  },
  record: {
    _id: "",
    userID: "",
    browsingHistory: [],
    collect: [],
    fans: [],
    following: [],
    order: [],
    socket: [],
  },
  tree: {
    _id: "",
    ownerID: local.getItem("user")?._id || "",
    type: "",
    height: "",
    diameter: "",
    crownDiameter: "",
    branchPoint: "",
    hci: 0,
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
    payTime: "",
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
  /**
   *
   * @param {proxy} record
   * @param {string} userID
   * @param {string} treeID
   */
  collect: async (record, userID, treeID) => {
    const index = record.collect.indexOf(treeID);
    const params = { userID, treeID, mode: 1 };
    await request.post(api.record.modifyRecordTree, params);
    if (index == -1) {
      record.collect.push(treeID);
      ElMessage.warning("收藏成功");
    } else {
      record.collect.splice(index, 1);
      ElMessage.warning("取消收藏成功");
    }
  },
  /**
   *
   * @param {proxy} record
   * @param {string} userID1 主
   * @param {string} userID2 次
   */
  follow: async (record, userID1, userID2) => {
    const index = record.following.indexOf(userID2);
    const params = { userID1, userID2 };
    await request.post(api.record.modifyRecordUser, params);
    if (index == -1) {
      record.following.push(userID2);
      ElMessage.success("关注成功");
    } else {
      record.following.splice(index, 1);
      ElMessage.success("取消关注成功");
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
