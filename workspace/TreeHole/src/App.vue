<!--
 * @Author: Akira
 * @Date: 2022-11-14 09:08:28
 * @LastEditTime: 2023-04-25 13:30:39
-->
<script setup>
import { nextTick, onBeforeUnmount, ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";
import { useRoute } from "vue-router";
import { socket } from "./lib/socketio";
import { local } from "./util";
import { ElNotification } from "element-plus";
import { toSocket } from "./util/handleRouter";

const route = useRoute();

const whitelist = ["Login", "Register"];
const whitelist_reload = ["Login", "Register", "Socket"];
const isRouterAlive = ref(true);

/** 刷新 */
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};

/** 通知 */
const handlerNotice = (content) => {
  const loginUser = local.getItem("user");
  const { senderName, senderID, receiverID, context, tree } = content;
  if (loginUser) {
    if (content.receiverID == loginUser._id) {
      const notification = ElNotification({
        title: senderName,
        message: context,
        onClick: async () => {
          await toSocket(senderID, receiverID, tree);
          notification.close();
        },
      });
    }
  }
};

socket.on("notice", handlerNotice);

onBeforeUnmount(() => {
  socket.off("notice", handlerNotice);
});
</script>

<template>
  <!-- 侧边栏 -->
  <Sidebar v-if="whitelist.indexOf(route.name) == -1" />
  <!-- 顶部栏 -->
  <Topbar v-if="whitelist.indexOf(route.name) == -1" />
  <i class="iconfont icon-shuaxin reload" @click="reload" v-if="whitelist_reload.indexOf(route.name) == -1"></i>
  <router-view v-slot="{ Component }" v-if="isRouterAlive">
    <keep-alive :include="['Dynamic', 'Home']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style lang="less" scoped>
.reload {
  font-weight: bold;
  font-size: 18px;
  background-color: rgb(255, 255, 255);
  padding: 15px;
  border: 1px solid rgb(227, 229, 231);
  border-radius: 12px;
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.1s;
  &:hover {
    background-color: rgb(227, 229, 231);
  }
  &:active {
    transform: scale(0.9);
  }
}
</style>
