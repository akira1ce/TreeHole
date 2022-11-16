<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

console.log(history.state);
</script>

<template>
  <div>Home</div>
</template>

<style lang="less" scoped></style>
