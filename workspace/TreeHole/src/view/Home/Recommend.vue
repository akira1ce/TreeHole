<script setup>
import api from "../../api";
import request from "../../api/request";
import { onMounted, reactive } from "vue-demi";
import { local } from "../../util";
import Card from "../../components/Card.vue";

// [state]
const user = local.getItem("user");
const state = reactive({
  treeList: [],
  pageNo: 1,
  limit: 16,
  infiniteScroll: false,
  skeletoning: true,
});

// [methods]
/**
 * 获取树列表
 */
const getTreeList = async () => {
  const { pageNo, limit } = state;
  let trees = await request.post(api.tree.getTreeList, { pageNo, limit });
  if (trees.length < state.limit) {
    state.infiniteScroll = true;
  }
  // res = res.filter((item) => item.status == 0);
  state.treeList.push(...trees);
  state.pageNo++;
};

onMounted(() => {
  setTimeout(() => {
    getTreeList();
    state.skeletoning = false;
  }, 200);
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getTreeList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
    <el-skeleton class="skeleton" :rows="15" animated v-show="state.skeletoning" />
    <el-empty class="empty" v-show="state.treeList.length == 0 && !state.skeletoning"></el-empty>
    <Card v-for="(tree, index) in state.treeList" :key="tree._id" :tree="tree" />
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
  overflow-y: auto;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 37vmin);
  align-content: flex-start;
  .skeleton {
    margin-top: 20px;
    grid-column: 1 / 6;
  }
  .empty {
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%);
  }
}
</style>
