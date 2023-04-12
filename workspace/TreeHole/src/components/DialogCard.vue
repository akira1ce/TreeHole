<!--
 * @Author: Akira
 * @Date: 2022-12-10 16:48:50
 * @LastEditTime: 2023-04-12 15:17:50
-->
<script setup>
import { useRoute, useRouter } from "vue-router";
import request from "../api/request";
import { computed } from "vue-demi";
import { local } from "../util";
import api from "../api";

const router = useRouter();
const route = useRoute();

const props = defineProps(["tree", "loginUser", "orderOp"]);
const { tree, loginUser, orderOp } = props;

/**
 * 跳转苗木详情
 * @param {string} treeID
 */
const toTreeDetail = async (userID, treeID) => {
  if (route.name == "TreeDetail") return;
  /** 浏览记录 */
  await request.post(api.history.addHistory, { userID, treeID });
  router.push({ name: "TreeDetail", state: { treeID } });
};

/**
 * 对话框 树卡片 订单处理按钮
 * 该按钮对应双方,会有不同的状态
 */
const orderBtn = computed(() => {
  let type = "";
  let content = "";
  let code = -1;
  if (tree.ownerID == loginUser._id) {
    type = "warning";
    content = "等待购买";
  } else {
    type = "warning";
    content = "立即购买";
    code = 0;
  }
  return { type, content, code };
});
</script>

<template>
  <!-- 对话框 树卡片 -->
  <div class="card">
    <div class="card__tree">
      <!-- 树-封面 -->
      <div class="tree__cover" @click="toTreeDetail(loginUser._id, tree._id)">
        <img :src="tree.imgs[0]?.url" />
      </div>
      <!-- 树-信息 -->
      <div class="tree__info">
        <span class="info__title">{{ tree.title }}</span>
        <span class="info__describe">{{ tree.describe }}</span>
      </div>
      <!-- 树-操作 -->
      <div class="tree__options">
        <!-- 树-价格 -->
        <span class="options__price">￥{{ tree.price }}</span>
        <!-- 树-订单处理 -->
        <el-button :type="orderBtn.type" round @click="orderOp(tree, orderBtn.code)" v-if="loginUser.role == '1'">{{ orderBtn.content }}</el-button>
        <!-- 取消 -->
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
  align-self: center;
  width: 45vw;
  height: 20vh;
  .card__tips {
    padding-top: 20px;
  }
  .card__tree {
    .flex__row();
    width: 100%;
    height: 100%;
    gap: 15px;
    padding: 20px;
    border-radius: 5px;
    background-color: white;
    .tree__cover {
      align-self: center;
      width: 30%;
      position: relative;
      img {
        width: 100%;
        cursor: pointer;
      }
    }
    .tree__info {
      .flex__column();
      flex: 1;
      gap: 10px;
      justify-content: flex-start;
      font-size: 18px;
      .info__describe {
        font-size: 16px;
        color: grey;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .tree__options {
      .flex__column();
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      .options__price {
        font-weight: bold;
        color: rgb(255, 75, 75);
      }
    }
  }
}
</style>
