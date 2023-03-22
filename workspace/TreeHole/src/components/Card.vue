<!--
 * @Author: Akira
 * @Date: 2022-11-18 17:01:04
 * @LastEditTime: 2023-03-21 13:55:00
-->
<script setup>
import { defineProps, toRaw } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { local } from "../util";

const router = useRouter();
const route = useRoute();

const props = defineProps(["tree"]);

const tree = props.tree;

// [methods]
/**
 * 跳转个人空间
 * @param {Object} user
 */
const toSpace = (user) => {
  if (history.state.spaceUser?._id == user._id) return;
  else if (route.name != "Space") router.push({ name: "Space", state: { spaceUser: toRaw(user) } });
  else {
    history.state.spaceUser = toRaw(user);
    router.go(0);
  }
};

/**
 * 跳转苗木详情
 * @param {string} treeID
 */
const toTreeDetail = async (treeID) => {
  try {
    if (route.name == "TreeDetail") return;
    await request.post(api.record.modifyRecordTree, { userID: local.getItem("user")._id, treeID, mode: 0, clearAll: 0 });
    router.push({ name: "TreeDetail", state: { treeID } });
  } catch (error) {
    ElMessage.error(error.message);
  }
};
</script>

<template>
  <!-- 首页树卡片 -->
  <div class="card">
    <!-- 树-封面 -->
    <img class="card__cover" :src="tree.imgs[0]?.url" @click="toTreeDetail(tree._id)" />
    <!-- 树-标题 -->
    <div class="card__title">{{ tree.title }}</div>
    <!-- 树-拥有者 -->
    <div class="card__author" @click="toSpace(tree.owner)"><i class="iconfont icon-shuye"></i> {{ `${tree.owner.name} · ${tree.time.split(" ")[0]}` }}</div>
  </div>
</template>

<style lang="less" scoped>
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
.card {
  .flex__column();
  margin: 12px;
  position: relative;
  .card__cover {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    transition: all 0.5s;
    object-fit: cover;
    cursor: pointer;
    &:hover {
      transform: scale(1.05);
    }
  }
  .card__title {
    margin: 10px 0;
    font-size: 15px;
    cursor: pointer;
  }
  .card__author {
    .flex__row();
    align-items: center;
    font-size: 13px;
    color: @defaultColor;
    cursor: pointer;
    .icon-shuye {
      font-size: 16px;
      margin-right: 4px;
      color: @activeColor;
    }
  }
  .card__title,
  .card__author {
    transition: all 0.5s;
    &:hover {
      color: @activeColor;
    }
  }
}
</style>
