<script setup>
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, toRaw } from "vue-demi";
import { useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { defaultState, local } from "../util";

const router = useRouter();

const state = reactive({
  order: history.state.order || defaultState.order,
  loginUser: local.getItem("user") || {},
});

// [methods]
/**
 * 取消订单
 * @param {string} orderID
 */
const cancelOrder = async (order) => {
  await request.post(api.order.removeById, { _id: order._id });
  await request.post(api.tree.modifyById, { _id: order.treeID, state: 0 });
  if (state.order.status == 1) {
    const refundRes = await request.post(api.alipay.refund, { orderID: order._id, price: order.tree.price });
    ElMessage.success("已取消订单并退款成功");
  }
  ElMessage.success("已取消订单");
  history.state.order = null;
  toSpace(seller, tree.value._id);
};

/**
 * 跳转个人空间
 * - 若 treeID 存在，滚动条跳转至对应位置
 * @param {object} spaceUser
 * @param {string} treeID
 */
const toSpace = (spaceUser, treeID) => {
  spaceUser = toRaw(spaceUser);
  router.push({ name: "Space", state: { spaceUser, treeID } });
};

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
  router.push({ name: "Socket", state: { userID: userID2, treeID } });
};

// [computed]
const tree = computed(() => {
  return state.order.tree || {};
});
const buyer = computed(() => {
  return state.order.buyer || {};
});
const seller = computed(() => {
  return state.order.seller || {};
});
const isCurrent = computed(() => {
  return buyer.value._id == state.loginUser._id;
});

onMounted(async () => {
  const orderID = state.order._id;
  if (!orderID) {
    ElMessage.error("订单不存在");
    return;
  }
  const queryRes = await request.post(api.alipay.query, { orderID });
  ElMessage.success(queryRes.massage);
  console.log(`output->queryRes`, queryRes);
});
</script>

<template>
  <div class="container">
    <!-- 空状态 -->
    <el-empty class="empty" v-if="state.order._id == ''"></el-empty>

    <!-- 订单 -->
    <div class="container__order" v-else>
      <!-- 订单状态 -->
      <div class="order__status" shadow="hover">
        <div class="status__icon">
          <div class="icon__item">
            <i class="iconfont icon-round_check" v-if="state.order.status > '-1'"></i>
            <i class="iconfont icon-round" v-else></i>
            <span class="item__line" :class="{ lineActive: state.order.status > '-1' }"></span>
          </div>
          <div class="icon__item">
            <i class="iconfont icon-round_check" v-if="state.order.status > '0'"></i>
            <i class="iconfont icon-round" v-else></i>
            <span class="item__line" :class="{ lineActive: state.order.status > '0' }"></span>
          </div>
          <div class="icon__item">
            <i class="iconfont icon-round_check" v-if="state.order.status > '1'"></i>
            <i class="iconfont icon-round" v-else></i>
            <span class="item__line" :class="{ lineActive: state.order.status > '1' }"></span>
          </div>

          <div class="icon__item">
            <i class="iconfont icon-round_check" v-if="state.order.status > '1'"></i>
            <i class="iconfont icon-round" v-else></i>
          </div>
        </div>
        <div class="status__tag">
          <span class="tag__text" :class="{ textActive: state.order.status > '-1' }">已拍下</span>
          <span class="tag__text" :class="{ textActive: state.order.status > '0' }" style="margin-left: 8px">已付款</span>
          <span class="tag__text" :class="{ textActive: state.order.status > '1' }" style="margin-left: 8px">已收货</span>
          <span class="tag__text" :class="{ textActive: state.order.status > '2' }">交易成功</span>
        </div>
      </div>
      <!-- 苗木信息 -->
      <div class="order__tree" @click="toSpace(seller, tree._id)">
        <!-- 封面 -->
        <img class="tree__cover" :src="tree.imgs[0]" />
        <!-- 详细信息 -->
        <div class="tree__info">
          <!-- 标题 -->
          <div class="info__title">
            <span class="title__content">{{ tree.title }}</span>
            <el-tag size="large" type="danger" class="title__price">￥{{ tree.price }}</el-tag>
          </div>
          <!-- 描述 -->
          <span class="info__describe"> {{ tree.describe }}</span>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="order__info">
        <!-- 头部 -->
        <div class="info__header">
          <span class="header__title">订单信息</span>
          <el-button round @click="toSocket(buyer._id, seller._id, tree._id)">{{ isCurrent ? "联系卖家" : "联系买家" }}</el-button>
        </div>
        <!-- 主体 -->
        <div class="info__main">
          <span>{{ isCurrent ? `卖家昵称: ${seller.name}` : `买家昵称: ${buyer.name}` }}</span>
          <span>商品名称: {{ tree.title }}</span>
          <span>交易金额: ￥{{ tree.price }}</span>
          <span>订单编号: {{ state.order._id }}</span>
          <span>拍下时间: {{ state.order.time.split(",").join(" ") }}</span>
          <span v-if="state.order.status > '0'">付款时间: {{}}</span>
          <span v-if="state.order.status > '1'">交易完成时间: {{}}</span>
          <span
            >支付状态: <el-tag :type="state.order.status == 0 ? 'warning' : 'success'">{{ state.order.status == 0 ? "未支付" : "已支付" }}</el-tag></span
          >
        </div>
      </div>
      <div class="order__option">
        <el-button @click="cancelOrder(state.order)">取消订单</el-button>
        <!-- 买家 -->
        <el-button v-if="isCurrent && state.order.status == 0">立即支付</el-button>
        <el-button v-if="isCurrent && state.order.status == 1">确认收货</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@defaultColor: rgb(241, 242, 243);
@activeColor: rgb(94, 161, 97);

// calc sidebar topbar
@sidebar_width: 65px;
@topbar_height: 75px;
.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}
.container {
  .flex__column();
  align-items: center;
  height: calc(100vh - @topbar_height);
  overflow-y: auto;
  position: relative;
  padding: 0px 3.333vw;
  background-color: @defaultColor;
  .empty {
    flex: 1;
  }
  .container__order {
    .flex__column();
    gap: 20px;
    width: 80%;
    height: 100%;
    padding: 30px;
    background-color: white;
    .order__status {
      .flex__column();
      margin: 40px 20px;
      .status__icon {
        .flex__row();
        align-items: center;
        padding: 0 18px 0 12px;
        .icon__item {
          .flex__row();
          align-items: center;
          flex: 1;
          &:last-child {
            flex: none;
          }
          .item__line {
            flex: 1;
            height: 1px;
            background-color: grey;
          }
          .lineActive {
            background-color: black;
          }
          .iconfont {
            font-size: 20px;
            color: grey;
          }
          .icon-round_check {
            color: @activeColor;
          }
        }
      }
      .status__tag {
        .flex__row();
        justify-content: space-between;
        font-size: 14px;
        color: grey;
        .textActive {
          color: black;
        }
      }
    }
    .order__tree {
      .flex__row();
      gap: 20px;
      cursor: pointer;
      .tree__cover {
        width: 200px;
      }
      .tree__info {
        flex: 1;
        .flex__column();
        gap: 10px;
        .info__title {
          .flex__row();
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          .title__price {
            font-weight: bold;
          }
        }
        .info__describe {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
      }
    }
    .order__info {
      .flex__column();
      flex: 1;
      gap: 10px;
      .info__header {
        .flex__row();
        justify-content: space-between;
        align-content: center;
        .header__title {
          font-size: 20px;
          line-height: 32px;
        }
      }
      .info__main {
        .flex__column();
        gap: 10px;
        color: #494545;
        font-size: 16px;
        .main__item {
        }
      }
    }
    .order__option {
      .flex__row();
      justify-content: flex-end;
    }
  }
}
</style>
