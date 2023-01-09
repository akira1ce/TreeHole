<script setup>
import { onMounted, reactive } from "vue-demi";
import api from "../api";
import request from "../api/request";

const state = reactive({
  order: history.state?.order || {},
});
onMounted(async () => {
  const orderID = state.order._id;
  const queryRes = await request.post(api.alipay.query, { orderID });
  console.log(`output->queryRes`, queryRes);
});
</script>

<template>
  <div>{{ state.order }}</div>
</template>

<style lang="less" scoped></style>
