<!--
 * @Author: Akira
 * @Date: 2022-11-14 18:57:18
 * @LastEditTime: 2023-03-03 17:41:46
-->
<script setup>
import api from "../api";
import request from "../api/request";
import { onMounted, reactive } from "vue-demi";
import { defaultState, local } from "../util";
import Card from "../components/Card.vue";
import Loader from "../components/Loader.vue";
import eventBus from "../lib/eventBus";

const navMenu = ["recommend", "area"];
const state = reactive({
  user: local.getItem("user") || {},
  record: { ...defaultState.record },
  current: local.getItem("current_home") || 0,
  currentList: {
    pageNo: 1,
    limit: 16,
    content: [],
    infiniteScroll: false,
  },
  recommend: {
    pageNo: 1,
    limit: 16,
    content: [],
    infiniteScroll: false,
  },
  area: {
    pageNo: 1,
    limit: 16,
    content: [],
    infiniteScroll: false,
  },
  isLoader: true,
});

// [methods]
const switchNav = (target) => {
  // 缓存
  state.current = target;
  local.setItem("current_home", target);

  state.currentList = state[navMenu[target]];

  // 首次特判
  if (state.currentList.content.length == 0) {
    state.isLoader = true;
    setTimeout(async () => {
      await getCurrentList();
      state.isLoader = false;
    }, 1500);
  }
};

/**
 * 获取树列表
 */
const getCurrentList = async () => {
  const { current, record } = state;

  // 定位当前集合
  const currentList = state[navMenu[current]];
  const { pageNo, limit } = currentList;

  let data = null;
  // recommend 和 area 唯一区分
  if (current == 0) data = await request.post(api.tree.getRecommendTreeList, { trees: record.browsingHistory, pageNo, limit });
  else data = await request.post(api.tree.getAreaTreeList, { area: state.user.location.split("-")[1], pageNo, limit });

  // 更新缓存
  currentList.content.push(...data.list);
  currentList.pageNo++;

  // 在所有数据加载完毕之后，判断是否加载完毕
  if (data.list.length < currentList.limit) currentList.infiniteScroll = true;
};

// [mitt]
eventBus.on("switchNav", switchNav);

onMounted(async () => {
  try {
    const userID = state.user._id;
    state.record = await request.post(api.record.getRecordByUserID, { userID });
    switchNav(state.current);
  } catch (error) {
    ElMessage.error(error.message);
  }
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getCurrentList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.currentList.infiniteScroll">
    <el-empty class="center" v-if="state.currentList.content.length == 0 && !state.isLoader" description="这里没有数据了~"></el-empty>
    <Loader class="center" v-if="state.isLoader"></Loader>
    <Card v-for="(item, index) in state.currentList.content" :key="item._id" :tree="item" />
  </div>
</template>

<style lang="less" scoped>
//font
@defaultFont: PingFang SC, Microsoft YaHei;

//color
@defaultColor: rgb(155, 161, 166);
@activeColor: rgb(94, 161, 97);

// calc sidebar topbar
@sidebar_width: 120px;
@topbar_height: 75px;

.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}
.container {
  height: calc(100vh - @topbar_height);
  overflow-y: overlay;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 37vmin);
  align-content: flex-start;
  position: relative;
}
</style>
