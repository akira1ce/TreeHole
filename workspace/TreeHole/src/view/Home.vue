<!--
 * @Author: Akira
 * @Date: 2022-11-14 18:57:18
 * @LastEditTime: 2023-04-25 19:10:48
-->
<script setup>
import { onMounted, reactive, onBeforeUnmount } from "vue-demi";
import Loader from "../components/Loader.vue";
import { local } from "../util";
import Card from "../components/Card.vue";
import eventBus from "../lib/eventBus";
import request from "../api/request";
import api from "../api";

const navMenu = ["recommend", "area"];
const state = reactive({
  user: local.getItem("user") || {},
  /** 当前导航 */
  current: local.getItem("current_home") || 0,
  currentList: {
    pageNo: 1,
    limit: 16,
    content: [],
    infiniteScroll: false,
  },
  /** 推荐 */
  recommend: {
    pageNo: 1,
    limit: 16,
    content: [],
    infiniteScroll: false,
  },
  /** 地区 */
  area: {
    pageNo: 1,
    limit: 16,
    content: [],
    infiniteScroll: false,
  },
  isLoader: true,
  isShow: false,
});

/** 切换导航 */
const switchNav = (target) => {
  /** 缓存 */
  state.current = target;
  local.setItem("current_home", target);
  state.currentList = state[navMenu[target]];
  /** 首次特判 */
  if (state.currentList.content.length == 0) {
    state.isLoader = true;
    setTimeout(async () => {
      await getCurrentList();
      state.isLoader = false;
    }, 1500);
  }
};

/** 获取树列表 */
const getCurrentList = async () => {
  const { current, user } = state;

  /** 定位当前集合 */
  const { pageNo, limit } = state.currentList;

  let data = null;
  // recommend 和 area 唯一区分
  if (current == 0) data = await request.post(api.tree.getRecommendTreeList, { userID: user._id, pageNo, limit });
  else data = await request.post(api.tree.getAreaTreeList, { area: state.user.location.split("-")[1], pageNo, limit });

  /** 更新缓存 */
  state.currentList.content.push(...data.list);
  state.currentList.pageNo++;

  /** 在所有数据加载完毕之后，判断是否加载完毕 */
  if (data.list.length == 0) state.currentList.infiniteScroll = true;
};

eventBus.on("switchNav", switchNav);

onMounted(async () => {
  console.log(1);
  switchNav(state.current);
  state.isShow = true;
});

onBeforeUnmount(() => {
  eventBus.off("switchNav", switchNav);
});
</script>

<template>
  <div class="container scroll" v-if="state.isShow" v-infinite-scroll="getCurrentList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.currentList.infiniteScroll">
    <Loader class="center" v-if="state.isLoader"></Loader>
    <el-empty class="center" v-else-if="state.currentList.content.length == 0" description="这里没有数据了~"></el-empty>
    <Card v-else v-for="item in state.currentList.content" :key="item._id" :tree="item" />
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
