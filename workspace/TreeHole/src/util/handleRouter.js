/*
 * @Author: Akira
 * @Date: 2023-04-25 13:11:34
 * @LastEditTime: 2023-04-25 14:25:00
 */
import api from "../api";
import mitt from "../lib/eventBus";
import request from "../api/request";
import router from "../router/index";
import { toRaw } from "vue";

const route = router.currentRoute;
/**
 * 跳转聊天
 * - user1
 * - user2
 * - tree
 * @param {string} userID1
 * @param {string} userID2
 * @param {Object} tree
 */
export const toSocket = async (userID1, userID2, tree) => {
  /** 新增会话 */
  await request.post(api.socket.addSocket, { userID1, userID2, treeID: tree._id, tree });
  if (route.value.name == "Socket") mitt.emit("initSocket");
  else router.push({ name: "Socket", state: { userID: userID2, treeID: tree._id } });
};

/**
 * 跳转个人空间
 * @param {Object} user
 */
export const toSpace = (spaceUser) => {
  spaceUser = toRaw(spaceUser);
  if (history.state.spaceUser?._id == spaceUser._id) return;
  else if (route.value.name != "Space") router.push({ name: "Space", state: { spaceUser } });
  else {
    history.state.spaceUser = spaceUser;
    router.go(0);
  }
};

/**
 * 跳转苗木详情
 * @param {string} treeID
 */
export const toTreeDetail = async (userID, treeID) => {
  if (route.value.name == "TreeDetail") return;
  /** 浏览记录 */
  await request.post(api.history.addHistory, { userID, treeID });
  router.push({ name: "TreeDetail", state: { treeID } });
};

/** 跳转记录 - 关注 - 粉丝 */
export const toRecord = (mode) => {
  router.push({ name: "Record", state: { mode } });
};

/** register */
export const toRegister = () => {
  router.push({ name: "Register" });
};

export const toLogin = () => {
  router.push("/login");
};
