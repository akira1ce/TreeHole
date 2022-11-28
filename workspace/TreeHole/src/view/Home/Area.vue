<script setup>
import api from "../../api";
import request from "../../api/request";
import { onMounted, reactive, ref } from "vue-demi";
import Card from "../../components/Card.vue";

// [state]
const user = JSON.parse(localStorage.getItem("user"));
const state = reactive({
  treeList: [],
});

// [methods]
// getTreeList
const getTreeList = () => {
  const location = user.location;
  setTimeout(async () => {
    let res = await request.get(api.tree.getTreeList);
    // filter current location
    res = res.filter((item) => item.location.indexOf(location?.split("-")[1]) != -1);
    state.treeList = res;
  }, 300);
};

onMounted(async () => {
  getTreeList();
});
</script>

<template>
  <div class="container scroll">
    <el-skeleton class="skeleton" :rows="10" animated v-show="state.treeList.length == 0" />
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
}
</style>
