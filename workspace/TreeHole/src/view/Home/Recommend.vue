<script setup>
import api from "../../api";
import request from "../../api/request";
import { onMounted, reactive } from "vue-demi";
import Card from "../../components/Card.vue";

// [state]
const user = JSON.parse(localStorage.getItem("user"));
const state = reactive({
  treeList: [],
});

// [methods]
// getTreeList
const getTreeList = () => {
  setTimeout(async () => {
    let res = await request.get(api.tree.getTreeList);
    const { browsingHistory } = await request.post(
      api.record.getRecordByUserID,
      { userID: user._id }
    );
    // filter in browsingHistory
    res = res.filter(
      (item) => !browsingHistory.find((browItem) => browItem._id == item._id)
    );
    state.treeList = res;
  }, 500);
};

onMounted(() => {
  getTreeList();
});
</script>

<template>
  <div class="container scroll">
    <el-skeleton
      class="skeleton"
      :rows="10"
      animated
      v-show="state.treeList.length == 0"
    />
    <Card
      v-for="(tree, index) in state.treeList"
      :key="tree._id"
      :tree="tree"
    />
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
}
</style>
