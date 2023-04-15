<!--
 * @Author: Akira
 * @Date: 2022-11-14 09:08:28
 * @LastEditTime: 2023-04-14 15:12:36
-->
<script setup>
import { nextTick, ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const whitelist = ["Login", "Register"];
const isRouterAlive = ref(true);

/** 刷新 */
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
</script>

<template>
  <!-- 侧边栏 -->
  <Sidebar v-if="whitelist.indexOf(route.name) == -1" />
  <!-- 顶部栏 -->
  <Topbar v-if="whitelist.indexOf(route.name) == -1" />
  <i class="iconfont icon-shuaxin reload" @click="reload" v-if="whitelist.indexOf(route.name) == -1"></i>
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
  padding: 12px;
  border: 1px solid rgb(227, 229, 231);
  border-radius: 12px;
  position: fixed;
  right: 80px;
  bottom: 80px;
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
