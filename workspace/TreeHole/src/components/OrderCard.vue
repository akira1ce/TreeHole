<!--
 * @Author: Akira
 * @Date: 2022-11-26 10:49:01
 * @LastEditTime: 2023-04-12 09:49:36
-->
<script setup>
import { computed, defineProps, toRaw } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import request from "../api/request";
import { local } from "../util";
import api from "../api";

const router = useRouter();
const route = useRoute();

const props = defineProps(["order", "deleteOrder", "index"]);

const { order, deleteOrder, index } = props;
const loginUser = local.getItem("user");

/**
 * 跳转聊天
 * - user1
 * - user2
 * - tree
 * @param {string} userID1
 * @param {string} userID2
 * @param {string} treeID
 */
const toSocket = async (userID1, userID2, tree) => {
  const treeID = tree._id;
  /** 新增会话 */
  await request.post(api.socket.addSocket, { userID1, userID2, treeID, tree });
  router.push({ name: "Socket", state: { userID: userID2, treeID } });
};

/**
 * 跳转个人空间
 * @param {proxy} user
 */
const toSpace = (user) => {
  if (route.name == "Space" && history.spaceUser._id != user._id) return;
  router.push({ path: "/space", state: { spaceUser: toRaw(user) } });
};

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
 * 查看订单
 * @param {object} order
 */
const checkOrder = (order) => {
  order = toRaw(order);
  router.push({ name: "OrderDetail", state: { treeID: order.treeID } });
};

// 当前聊天对方
const otherSide = computed(() => {
  return loginUser._id == order.buyerID ? order.seller : order.buyer;
});

// 订单标签
const tag = computed(() => {
  if (order.status == 0) return { status: "error", content: "待付款" };
  if (order.status == 1) return { status: "warning", content: "待收货" };
  if (order.status == 2) return { status: "success", content: "已完成" };
});
</script>

<template>
  <!-- 个人中心 订单卡片 -->
  <div class="order">
    <!-- 订单-对方 -->
    <div class="order__otherSide" @click="toSpace(otherSide)">
      <img class="otherSide__avator" :src="otherSide.avator" alt="" />
      <span class="otherSide_name">{{ otherSide.name }}</span>
    </div>
    <!-- 订单-树 -->
    <div class="order__tree" @click="toTreeDetail(loginUser._id, order.tree._id)">
      <img class="tree__cover" :src="order.tree.imgs[0]?.url" alt="" />
      <span class="tree__title">{{ order.tree.title }}</span>
    </div>
    <!-- 订单-基本信息 -->
    <div class="order__info">
      <span class="info__time">{{ new Date(order.time).toLocaleString() }}</span>
      <el-tag class="info__status" :type="tag.status">{{ tag.content }}</el-tag>
    </div>
    <!-- 订单-操作按钮 -->
    <div class="order-btns">
      <el-button round @click="toSocket(order.sellerID, order.buyerID, order.tree)">联系树友</el-button>
      <el-button type="warning" round @click="checkOrder(order)">查看订单</el-button>
      <i class="iconfont icon-lajitong order-delete" @click="deleteOrder(order._id, index)" v-if="order.status == 2"></i>
    </div>
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
.order {
  .flex__row();
  align-items: center;
  padding: 15px 10px;
  .order__otherSide,
  .order__tree,
  .order__info,
  .order-btns {
    flex: 1;
  }
  .order__otherSide {
    .flex__row();
    flex: 0.5;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    .otherSide__avator {
      width: 40px;
      border-radius: 100px;
      cursor: pointer;
    }
  }

  .order__tree {
    .flex__row();
    align-items: center;
    cursor: pointer;
    .tree__cover {
      width: 100px;
      margin-right: 20px;
    }
    .tree__title {
      max-width: 250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .order__info {
    .flex__row();
    gap: 30px;
    align-items: center;
  }
  .order-btns {
    .flex__row();
    flex: 0.3;
    align-items: center;
    gap: 5px;
    .order-delete {
      margin-left: 20px;
      font-size: 25px;
      opacity: 0;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: red;
      }
    }
  }

  &:hover {
    .order-delete {
      opacity: 1;
    }
  }
}
</style>
