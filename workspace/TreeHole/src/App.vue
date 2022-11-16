<script setup>
import Sidebar from "./components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";
import { useRoute } from "vue-router";
import { computed, reactive, ref, watch } from "vue-demi";

const route = useRoute();
const whitelist = ['Login','Register']
</script>

<template>
  <Sidebar v-show="whitelist.indexOf(route.name)==-1" />
  <Topbar v-show="whitelist.indexOf(route.name)==-1" />
  <router-view></router-view>
</template>

<style lang="less" scoped></style>
