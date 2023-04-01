<!--
 * @Author: Akira
 * @Date: 2022-11-14 09:08:28
 * @LastEditTime: 2023-04-01 17:13:17
-->
<script setup>
import Sidebar from "./components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const whitelist = ["Login", "Register"];
</script>

<template>
  <!-- 侧边栏 -->
  <Sidebar v-if="whitelist.indexOf(route.name) == -1" />
  <!-- 顶部栏 -->
  <Topbar v-if="whitelist.indexOf(route.name) == -1" />
  <router-view v-slot="{ Component }">
    <keep-alive :include="['Dynamic', 'Home', 'Space', 'Personal']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style lang="less" scoped></style>
