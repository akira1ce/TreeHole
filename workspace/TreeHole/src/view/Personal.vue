<!--
 * @Author: Akira
 * @Date: 2022-11-16 16:40:05
 * @LastEditTime: 2023-04-14 15:17:14
-->
<script setup>
import { computed, onMounted, reactive, ref, toRaw } from "vue-demi";
import OrderCard from "../components/OrderCard.vue";
import { useRouter, useRoute } from "vue-router";
import { local, defaultState } from "../util";
import Card from "../components/Card.vue";
import { ElMessage } from "element-plus";
import request from "../api/request";
import api from "../api";

const router = useRouter();
const route = useRoute();

const sliderRef = ref();

// 导航
const navMenu = ["历史记录", "我的收藏", "我的交易"];
const sliderLeft = ["22px", "125px", "228px"];

const user = local.getItem("user");

const state = reactive({
  current: 0,
  currentList: {
    pageNo: 1,
    limit: 12,
    infiniteScroll: false,
    list: [],
  },
  /** 浏览记录 */
  historyList: {
    pageNo: 1,
    limit: 12,
    infiniteScroll: false,
    list: [],
  },
  /** 收藏 */
  collectList: {
    pageNo: 1,
    limit: 12,
    infiniteScroll: false,
    list: [],
  },
  /** 订单 */
  orderList: {
    pageNo: 1,
    limit: 6,
    infiniteScroll: false,
    list: [],
  },
  record: defaultState.record,
  isLoading: true,
  followCount: 0,
  fansCount: 0,
});

/**
 * 跳转个人空间
 * @param {proxy} user
 */
const toSpace = (user) => {
  if (history.state.spaceUser?._id == user._id) return;
  else if (route.name != "Space") router.push({ name: "Space", state: { spaceUser: toRaw(user) } });
  else {
    history.state.spaceUser = toRaw(user);
    router.go(0);
  }
};

/** 跳转记录 - 关注 - 粉丝 */
const toRecord = (mode) => {
  router.push({ name: "Record", state: { mode } });
};

/**
 * 切换导航 -> 我的收藏 历史记录 我的订单
 * @param {number} index
 */
const switchNav = async (target) => {
  /** 缓存 */
  state.current = target;
  local.setItem("current_personal", target);

  sliderRef.value.style.left = sliderLeft[target];

  if (target == 0) state.currentList = state.historyList;
  else if (target == 1) state.currentList = state.collectList;
  else state.currentList = state.orderList;

  /** 首次特判 */
  if (state.currentList.list.length == 0) {
    state.isLoading = true;
    await getCurrentList();
    setTimeout(() => {
      state.isLoading = false;
    }, 500);
  }
};

/** 清楚历史记录 */
const clearBrowsing = async (userID) => {
  await request.post(api.history.removeAllHistory, { userID });
  /** 更新缓存 */
  state.currentList.list = [];
  state.currentList.infiniteScroll = false;
  ElMessage.success("浏览记录已清空");
};

/**
 * 删除订单
 * @param {string} orderID
 * @param {number} index
 */
const deleteOrder = async (orderID, index) => {
  if (state.currentList.list[index].status != 2) {
    ElMessage.warning("订单进行中...");
    return;
  }
  await request.post(api.record.modifyRecordOrder, { userID: user._id, orderID });
  state.record.order.splice(index, 1);
  state.currentList.list.splice(index, 1);
};

/** 分页加载导航数据 treeList or orderList */
const getCurrentList = async () => {
  /** 定位当前集合 */
  const { currentList, current } = state;
  const { pageNo, limit } = currentList;
  let data = null;
  /** order 和 tree 唯一区分 */
  if (current == 0) data = await request.post(api.history.getHistoryList, { userID: user._id, pageNo, limit });
  else if (current == 1) data = await request.post(api.collect.getCollectList, { userID: user._id, pageNo, limit });
  else data = await request.post(api.order.getOrderListByID, { orders: state.record.order, pageNo, limit });

  if (data.list.length == 0) {
    currentList.infiniteScroll = true;
    return;
  }

  /** 更新缓存 */
  currentList.list.push(...data.list);
  currentList.pageNo++;
};

/** 获取关注粉丝数量 */
const getCount = async (userID) => {
  const { followCount, fansCount } = await request.post(api.follow.getFollowCount, { userID });
  state.followCount = followCount;
  state.fansCount = fansCount;
};

onMounted(async () => {
  const userID = user._id;
  await getCount(userID);
  state.current = local.getItem("current_personal") || 0;
  switchNav(state.current);
});

const isEmpty = computed(() => {
  return state.currentList.list.length == 0;
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getCurrentList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.currentList.infiniteScroll">
    <!-- 用户栏 -->
    <div class="container__userInfo">
      <!-- 用户基本信息 -->
      <div class="userInfo__base">
        <div class="base__avator" @click="toSpace(user)">
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
        <div class="record__item" @click="toRecord(0)">
          <span class="item__count">{{ state.followCount }}</span>
          <span class="item__type">关注</span>
        </div>
        <div class="record__item" @click="toRecord(1)">
          <span class="item__count">{{ state.fansCount }}</span>
          <span class="item__type">粉丝</span>
        </div>
      </div>
      <!-- 个人空间 -->
      <div class="space" @click="toSpace(user)">空间 <i class="iconfont icon-youjiantou"></i></div>
    </div>
    <div class="container__main">
      <el-affix :offset="76" target=".container__main">
        <!-- 导航 -->
        <div class="main__navMenu">
          <div v-for="(item, index) in navMenu" class="navMenu__item" :class="{ active: state.current == index }" @click="switchNav(index)">
            {{ item }}
          </div>
          <div class="navMenu__slider" ref="sliderRef"></div>
          <div class="navMenu__clear" v-show="state.current == 0" @click="clearBrowsing(user._id)">
            <i class="iconfont icon-lajitong"></i>
            清空历史记录
          </div>
        </div>
      </el-affix>
      <!-- 主体 -->
      <div class="main__content" v-loading="state.isLoading">
        <el-empty class="center" v-if="isEmpty" description="什么也没有喔~"></el-empty>
        <!-- 树 -->
        <div class="content__trees" v-if="state.current < 2">
          <Card v-for="item in state.currentList.list" :key="item._id" :tree="item.tree" />
        </div>
        <!-- 订单 -->
        <div class="content__orders" v-else>
          <OrderCard v-for="(item, index) in state.currentList.list" :key="item._id" :order="item" :deleteOrder="deleteOrder" :index="index" />
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
  overflow-y: overlay;
  position: relative;
  box-sizing: border-box;
  padding: 30px 3.333vw;
  .container__userInfo {
    .flex__row();
    justify-list: space-between;
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
      background-color: rgb(255, 255, 255);
      border-bottom: 1px solid rgb(241, 242, 243);
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
      min-height: 415px;
      position: relative;
      .content__trees {
        display: grid;
        justify-content: space-around;
        grid-template-columns: repeat(auto-fill, 36vmin);
      }
    }
  }
}
</style>
