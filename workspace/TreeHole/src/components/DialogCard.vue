<script setup>
import { computed } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { local } from "../util";

const router = useRouter();
const route = useRoute();

// props
const props = defineProps(["tree", "loginUser", "otherSide", "toSpace", "orderOp"]);

// [state]
const { tree, loginUser, otherSide, toSpace, orderOp } = props;

// [methods]
/**
 * 跳转苗木详情
 * @param {string} treeID
 */
 const toTreeDetail = async (treeID) => {
  if (route.name == "TreeDetail") return;
  await request.post(api.record.modifyRecordTree, { userID: loginUser._id, treeID, mode: 0, clearAll: 0 });
  router.push({ name: "TreeDetail", state: { treeID } });
};

// [computed]
/**
 * 对话框 树卡片 订单处理按钮
 * 该按钮对应双方,会有不同的状态
 */
const orderBtn = computed(() => {
  let type = "";
  let content = "";
  let code = -1;
  if (tree.ownerID == loginUser._id) {
    if (tree.status == 0) {
      type = "warning";
      content = "等待购买";
    } else {
      type = "warning";
      content = "查看订单";
      code = 1;
    }
  } else {
    if (tree.status == 0) {
      type = "warning";
      content = "立即购买";
      code = 0;
    } else {
      type = "warning";
      content = "查看订单";
      code = 1;
    }
  }
  return { type, content, code };
});
</script>

<template>
  <!-- 对话框 树卡片 -->
  <div class="card">
    <div class="card__tree">
      <!-- 树-封面 -->
      <div class="tree__cover" @click="toTreeDetail(tree._id)">
        <img :src="tree.imgs[0]" />
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
  align-items: center;
  align-self: center;
  width: 550px;
  max-height: 155px;
  font-family: inherit;
  .card__tips {
    padding-top: 20px;
  }
  .card__tree {
    .flex__row();
    gap: 15px;
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    .tree__cover {
      img {
        width: 180px;
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
