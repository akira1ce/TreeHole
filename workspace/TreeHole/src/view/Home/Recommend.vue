<script setup>
import api from "../../api";
import request from "../../api/request";
import { onMounted, reactive } from "vue-demi";
import Card from "../../components/Card.vue";

const user = JSON.parse(localStorage.getItem("user"));
const state = reactive({
  treeList: [],
});

// [methods]
// getTreeList
const getTreeList = () => {
  try {
    setTimeout(async () => {
      let res = await request.get(api.tree.getTreeList);
      const { browsingHistory } = await request.post(
        api.record.getRecordByUserID,
        { userID: user._id }
      );
      // filter seen
      res = res.filter((item) => browsingHistory.indexOf(item._id) == -1);
      state.treeList = res;
    }, 500);
  } catch (e) {
    console.log(`output->e`, e);
  }
};
onMounted(() => {
  getTreeList();
});
</script>

<template>
  <div class="container">
    <el-skeleton :rows="10" animated v-show="state.treeList.length == 0" />
    <Card v-for="tree in state.treeList" :key="tree._id" :tree="tree" />
  </div>
</template>

<style lang="less" scoped>
//font
@defaultFont: PingFang SC, Microsoft YaHei;

//color
@defaultColor: rgb(155, 161, 166);
@activeColor: rgb(94, 161, 97);

.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}
.container {
  .flex__row();
  width: 86.833vw;
  padding: 2.2vw;
  margin: auto;
  overflow: hidden;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
}
</style>
