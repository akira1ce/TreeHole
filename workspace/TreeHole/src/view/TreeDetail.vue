<script setup>
import { onMounted, reactive } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { defaultState, local, recordHandle } from "../util";
import TreeCard from "../components/TreeCard.vue";

const router = useRouter();
const route = useRoute();

// [state]
const state = reactive({
  tree: { ...history.state.tree } || {},
  user: local.getItem("user") || {},
  record: defaultState.record,
});

// [methods]
/**
 * 收藏树
 * @param {string} treeID
 */
const collectHandle = (tree) => {
  recordHandle.collect(state.record, state.user, tree);
};

onMounted(async () => {
  const userID = state.user._id;
  state.record = await request.post(api.record.getRecordByUserID, { userID });
});
</script>

<template>
  <div class="container">
    <div class="container__content scroll">
      <TreeCard :key="state.tree._id" :tree="state.tree" :collectHandle="collectHandle" :record="state.record"></TreeCard>
    </div>
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(241, 242, 243);
@deepDefaultColor: rgb(227, 229, 231);
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
  justify-content: center;
  height: calc(100vh - 76px);
  overflow: hidden;
  position: relative;
  background-color: @defaultColor;
  .container__content {
    .flex__column();
    width: 60%;
    height: fit-content;
  }
}
</style>
