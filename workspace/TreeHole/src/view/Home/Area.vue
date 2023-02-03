<script setup>
import api from "../../api";
import request from "../../api/request";
import { onMounted, reactive, ref } from "vue-demi";
import { local } from "../../util";
import Card from "../../components/Card.vue";

// [state]
const user = local.getItem("user");
const state = reactive({
  treeList: [],
  skeletoning: true,
});

// [methods]
/**
 * 获取对应地区树列表
 */
const getTreeList = () => {
  const location = user.location;
  setTimeout(async () => {
    let res = await request.post(api.tree.getTreeList);
    // filter current location
    res = res.filter((item) => item.location.indexOf(location?.split("-")[1]) != -1 && item.status == 0);
    state.treeList = res;
    state.skeletoning = false;
  }, 300);
};

onMounted(async () => {
  getTreeList();
});
</script>

<template>
  <div class="container scroll">
    <el-empty class="empty" v-show="state.treeList.length == 0 && !state.skeletoning"></el-empty>
    <el-skeleton class="skeleton" :rows="15" animated v-show="state.skeletoning" />
    <Card v-for="(tree, index) in state.treeList" :key="tree._id" :tree="tree" />
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(155, 161, 166);
@activeColor: rgb(94, 161, 97);

// calc sidebar topbar
@sidebar_width: 65px;
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
  position: relative;
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
