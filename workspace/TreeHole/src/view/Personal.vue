<script setup>
import api from "../api";
import request from "../api/request";
import { computed, onMounted, reactive, ref, toRaw } from "vue-demi";
import { useRouter } from "vue-router";
import { local, defaultState } from "../util";
import Card from "../components/Card.vue";
import OrderCard from "../components/OrderCard.vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const sliderRef = ref();

// [state]
const navMenu = ["历史记录", "我的收藏", "我的交易"];
const sliderLeft = ["22px", "125px", "228px"];
const user = local.getItem("user");
const state = reactive({
  current: 0,
  currentList: [],
  record: defaultState.record,
});

// [methods]
/**
 * 取消订单
 * @param {string} orderID
 * @param {string} treeID
 * @param {number} index
 */
const removeOrder = async (orderID, treeID, index) => {
  await request.post(api.order.removeById, { _id: orderID });
  await request.post(api.tree.modifyById, { _id: treeID, state: 0 });
  state.record.order.splice(index, 1);
  state.record.orderList.splice(index, 1);
};

// 跳转个人空间
const toSpace = () => {
  router.push({ name: "Space" });
};

// 跳转记录 - 关注 - 粉丝
const toRecord = () => {
  router.push({ name: "Record" });
};

/**
 * 切换导航 -> 我的收藏 历史记录 我的订单
 * @param {number} index
 */
const switchNav = (index) => {
  state.current = index;
  sliderRef.value.style.left = sliderLeft[index];
  const record = state.record;
  if (index == 0) state.currentList = record.historyList;
  else if (index == 1) state.currentList = record.collectList;
  else state.currentList = record.orderList;
};

// 清楚历史记录
const clearBrowsing = async () => {
  state.record.browsingHistory = [];
  state.record.historyList = [];
  state.currentList = [];
  return;
  // prod
  const params = {
    userID: user._id,
    mode: 0,
    clearAll: 1,
  };
  await request.post(api.record.modifyRecordTree, params);
};

/**
 * 删除订单
 * @param {string} orderID
 * @param {number} index
 */
const deleteOrder = async (orderID, index) => {
  const params = {
    userID: user._id,
    orderID,
  };
  await request.post(api.record.modifyRecordOrder, params);
  state.record.order.splice(index, 1);
  state.record.orderList.splice(index, 1);
};

onMounted(async () => {
  let params = { userID: user._id };
  state.record = await request.post(api.record.getRecordByUserID, params);
  state.currentList = state.record.historyList;
});

// [computed]
const record = computed(() => {
  return state.record;
});
</script>

<template>
  <div class="container scroll">
    <!-- 用户栏 -->
    <div class="container__userInfo">
      <!-- 用户基本信息 -->
      <div class="userInfo__base">
        <div class="base__avator" @click="toSpace">
          <img class="avator" :src="user.avator" alt="" />
        </div>
        <div class="base__info">
          <div class="info__name">{{ user.name }}</div>
          <div class="info__location">
            <el-tag class="location__tag" type="success" v-for="item in user.location.split('-')">{{ item }}</el-tag>
          </div>
        </div>
      </div>
      <!-- 记录-动态关注粉丝 -->
      <div class="userInfo__record">
        <div class="record__item" @click="toSpace">
          <span class="item__count">{{ record.treeList?.length || "-" }}</span>
          <span class="item__type">动态</span>
        </div>
        <div class="record__item" @click="toRecord()">
          <span class="item__count">{{ record.following?.length || "-" }}</span>
          <span class="item__type">关注</span>
        </div>
        <div class="record__item" @click="toRecord()">
          <span class="item__count">{{ record.fans?.length || "-" }}</span>
          <span class="item__type">粉丝</span>
        </div>
      </div>
      <!-- 个人空间 -->
      <div class="space" @click="toSpace">空间 <i class="iconfont icon-youjiantou"></i></div>
    </div>
    <div class="container__main">
      <el-affix :offset="76">
        <!-- 导航 -->
        <div class="main__navMenu">
          <div v-for="(item, index) in navMenu" class="navMenu__item" :class="{ active: state.current == index }" @click="switchNav(index)">
            {{ item }}
          </div>
          <div class="navMenu__slider" ref="sliderRef"></div>
          <div class="navMenu__clear" v-show="state.current == 0" @click="clearBrowsing">
            <i class="iconfont icon-lajitong"></i>
            清空历史记录
          </div>
        </div>
      </el-affix>
      <!-- 主体 -->
      <div class="main__content">
        <!-- 树 -->
        <div class="content__trees" v-if="state.current < 2">
          <Card v-for="(item, index) in state.currentList" :key="item._id" :tree="item" />
        </div>
        <!-- 订单 -->
        <div class="content__orders" v-else>
          <OrderCard v-for="(item, index) in state.currentList" :key="item._id" :order="item" :deleteOrder="deleteOrder" :index="index" :removeOrder="removeOrder" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(155, 161, 166);
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
  height: calc(100vh - @topbar_height);
  overflow-y: auto;
  position: relative;
  padding: 30px 3.333vw;
  .container__userInfo {
    .flex__row();
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    padding: 30px 35px;
    background-color: rgb(246, 247, 248);
    .userInfo__base {
      .flex__row();
      flex: 1;
      .base__avator {
        .avator {
          width: 65px;
          border-radius: 65px;
          cursor: pointer;
        }
      }
      .base__info {
        .flex__column();
        padding: 0 20px;
        .info__name {
          padding: 10px 0;
          user-select: text;
          font-size: 18px;
          font-weight: bold;
        }
        .info__location {
          .location__tag {
            margin-right: 5px;
          }
        }
      }
    }
    .userInfo__record {
      .flex__row();
      .record__item {
        .flex__column();
        align-items: center;
        margin: 0 20px;
        cursor: pointer;
        .item__count {
          font-size: 20px;
          font-weight: 500;
          padding: 10px;
        }
        .item__type {
          font-size: 13px;
          color: @defaultColor;
        }
      }
    }
    .space {
      cursor: pointer;
      margin-left: 60px;
      color: @defaultColor;
    }
  }
  .container__main {
    position: relative;
    .main__navMenu {
      .flex__row();
      backdrop-filter: blur(2px) brightness(100%);
      background-color: rgba(255, 255, 255, 0.65);
      border-bottom: 1px solid rgb(241, 242, 243);
      // opacity: 0.9;
      position: relative;
      .navMenu__item {
        font-size: 16px;
        padding: 20px 0;
        margin-right: 40px;
        transition: all 0.5s;
        cursor: pointer;
        &:hover {
          color: @activeColor;
        }
      }
      .active {
        color: @activeColor;
      }
      .navMenu__slider {
        height: 3px;
        width: 22px;
        position: absolute;
        bottom: 0;
        left: 22px;
        transition: all 0.5s;
        background-color: @activeColor;
      }
      .navMenu__clear {
        position: absolute;
        right: 0;
        bottom: 10px;
        border: 1px solid rgb(227, 229, 231);
        border-radius: 6px;
        padding: 8px;
        font-size: 14px;
        color: rgb(93, 95, 99);
        transition: all 0.5s;
        cursor: pointer;
        &:hover {
          background-color: rgb(227, 229, 231);
        }
      }
    }
    .main__content {
      width: 100%;
      .content__trees {
        display: grid;
        justify-content: flex-start;
        grid-template-columns: repeat(auto-fill, 36vmin);
      }
    }
  }
}
</style>
