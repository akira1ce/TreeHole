<script setup>
import api from "../../api";
import request from "../../api/request";
import { onMounted, reactive } from "vue-demi";
import TreeCard from "../../components/TreeCard.vue";

const state = reactive({
  treeList: {},
});

onMounted(async () => {
  try {
    const res = await request.get(api.tree.getTreeList);
    state.treeList = res;
  } catch (e) {
    console.log(`output->e`, e);
  }
});
</script>

<template>
  <div class="container">
    <TreeCard v-for="tree in state.treeList" :key="tree._id" :tree="tree" />
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
  min-height: 48.333vw;
  padding: 2.2vw;
  margin: auto;
  overflow: hidden;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
}
</style>
