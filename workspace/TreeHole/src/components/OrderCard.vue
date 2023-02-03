<script setup>
import { Delete } from "@element-plus/icons-vue";
import { computed, defineProps, toRaw } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { local } from "../util";

const router = useRouter();
const route = useRoute();

const props = defineProps(["order", "deleteOrder", "index"]);

// [state]
const { order, deleteOrder, index } = props;
const user = local.getItem("user");

// [methods]
/**
 * 跳转聊天
 * - user1
 * - user2
 * - tree
 * @param {string} userID1
 * @param {string} userID2
 * @param {string} treeID
 */
const toSocket = async (userID1, userID2, treeID) => {
  await request.post(api.socket.addSocket, { userID1, userID2, treeID });
  router.push({ name: "Socket", state: { userID: otherSide.value._id, treeID } });
};

/**
 * 跳转个人空间
 * - 若 treeID 存在，滚动条跳转至对应位置
 * @param {object} spaceUser
 * @param {string} treeID
 */
const toSpace = async (spaceUser, treeID) => {
  if (spaceUser == undefined) {
    if (route.name == "Space") {
      history.state.spaceUser = null;
      router.go(0);
      return;
    }
    router.push({ name: "Space" });
    return;
  }
  spaceUser = toRaw(spaceUser);
  if (treeID) {
    const userID = local.getItem("user")._id;
    await request.post(api.record.modifyRecordTree, { userID, treeID, mode: 0, clearAll: 0 });
    router.push({ name: "Space", state: { spaceUser, treeID } });
  } else router.push({ name: "Space", state: { spaceUser } });
};

const spaceLink = () => {
  if (otherSide.value._id == order.tree.ownerID) toSpace(otherSide.value, order.tree._id);
  else toSpace(user, order.tree._id);
};

/**
 * 查看订单
 * @param {object} order
 */
const checkOrder = (order) => {
  order = toRaw(order);
  router.push({ name: "OrderDetail", state: { order } });
};

// [computed]
// 当前聊天对方
const otherSide = computed(() => {
  return user._id == order.buyerID ? order.seller : order.buyer;
});

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
    <div class="order__otherSide" @click="toSpace(otherSide, '')">
      <img class="otherSide__avator" :src="otherSide.avator" alt="" />
      <span class="otherSide_name">{{ otherSide.name }}</span>
    </div>
    <!-- 订单-树 -->
    <div class="order__tree" @click="spaceLink">
      <img class="tree__cover" :src="order.tree.imgs[0]" alt="" />
      <span class="tree__title">{{ order.tree.title }}</span>
    </div>
    <!-- 订单-基本信息 -->
    <div class="order__info">
      <span class="info__time">{{ order.time }}</span>
      <el-tag class="info__status" :type="tag.status">{{ tag.content }}</el-tag>
    </div>
    <!-- 订单-操作按钮 -->
    <div class="order-btns">
      <el-button round @click="toSocket(order.sellerID, order.buyerID, order.treeID)">联系树友</el-button>
      <el-button type="warning" round @click="checkOrder(order)" v-if="order.status != 2">查看订单</el-button>
      <el-button type="danger" round @click="deleteOrder(order._id, index)" v-if="order.status == 2">删除订单</el-button>
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
  justify-content: space-between;
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
    flex: 0.6;
    align-items: center;
    cursor: pointer;
    .otherSide__avator {
      width: 40px;
      border-radius: 100px;
      margin-right: 20px;
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
    align-items: center;
    .info__time {
      flex: 0.8;
    }
  }
  .order-btns {
    flex: 0.6;
    .order-delete {
      visibility: hidden;
    }
  }

  &:hover {
    .order-delete {
      visibility: visible;
    }
  }
}
</style>
