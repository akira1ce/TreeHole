<script setup>
import { defineProps, toRaw } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { local } from "../util";

const router = useRouter();
const route = useRoute();

const props = defineProps(["tree"]);

// [state]
const tree = props.tree;

// [methods]
/**
 * 跳转个人空间
 * - 若 treeID 存在，滚动条跳转至对应位置
 * @param {object} spaceUser
 * @param {string} treeID
 */
const toSpace = async (tree) => {
  tree = toRaw(tree);
  router.push({ name: "TreeDetail", state: { tree } });
  // if (spaceUser == undefined) {
  //   if (route.name == "Space") {
  //     history.state.spaceUser = null;
  //     router.go(0);
  //     return;
  //   }
  //   router.push({ name: "Space" });
  //   return;
  // }
  // spaceUser = toRaw(spaceUser);
  // if (treeID) {
  //   const userID = local.getItem("user")._id;
  //   await request.post(api.record.modifyRecordTree, { userID, treeID, mode: 0, clearAll: 0 });
  //   router.push({ name: "Space", state: { spaceUser, treeID } });
  // } else router.push({ name: "Space", state: { spaceUser } });
};
</script>

<template>
  <!-- 首页树卡片 -->
  <div class="card">
    <!-- 树-封面 -->
    <img class="card__cover" :src="tree.imgs[0]" @click="toSpace(tree)" />
    <!-- 树-标题 -->
    <div class="card__title">{{ tree.title }}</div>
    <!-- 树-拥有者 -->
    <div class="card__author" @click="toSpace(tree.owner)"><i class="iconfont icon-shuye"></i> {{ `${tree.owner.name} · ${tree.time.split(" ")[0]}` }}</div>
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
.card {
  .flex__column();
  margin: 12px;
  position: relative;
  font-family: @defaultFont;
  .card__cover {
    width: 34vmin;
    height: 100%;
    border-radius: 6px;
    transition: all 0.5s;
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
