<!--
 * @Author: Akira
 * @Date: 2022-11-26 10:49:01
 * @LastEditTime: 2023-04-25 14:12:28
-->
<script setup>
import { computed, defineProps, toRaw } from "vue-demi";
import { useRouter } from "vue-router";
import { toSocket, toSpace, toTreeDetail } from "../util/handleRouter";
import { local } from "../util";

const router = useRouter();

const props = defineProps(["order", "deleteOrder", "index"]);

const { order, deleteOrder, index } = props;
const loginUser = local.getItem("user");

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
  if (order.status == 0) return { status: "danger", content: "待付款" };
  else if (order.status == 1) return { status: "warning", content: "待收货" };
  else return { status: "success", content: "已完成" };
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
      width: 120px;
      margin-right: 20px;
      aspect-ratio: 1.74;
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
