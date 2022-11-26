<script setup>
import api from "../api";
import request from "../api/request";
import Card from "../components/Card.vue";
import OrderCard from "../components/OrderCard.vue";
import { computed, onMounted, reactive, ref } from "vue-demi";
import { useRouter } from "vue-router";

const router = useRouter();
const sliderRef = ref();
// [state]
const state = reactive({
  user: JSON.parse(localStorage.getItem("user")),
  current: 0,
  currentList: [],
  record: {
    _id: "",
    userID: "",
    current: 0,
    following: [],
    fans: [],
    collect: [],
    treeList: [],
    browsingHistory: [],
    order: [],
  },
});

const navMenu = ["历史记录", "我的收藏", "我的交易"];
const sliderLeft = ["22px", "125px", "228px"];

// [methods]
const toSpace = () => {
  router.push({ name: "Space" });
};

const switchNav = (index) => {
  state.current = index;
  sliderRef.value.style.left = sliderLeft[index];
  const record = state.record;
  if (index == 0) state.currentList = record.browsingHistory;
  else if (index == 1) state.currentList = record.collect;
  else state.currentList = record.order;
};

const clearBrowsing = async () => {
  state.record.browsingHistory = [];
  state.currentList = [];
  return;
  // prod
  const params = {
    userID: state.user._id,
    mode: 3,
    clearAll: true,
  };
  await request.post(api.record.modifyRecord, params);
};

onMounted(async () => {
  let params = { userID: state.user._id };
  state.record = await request.post(api.record.getRecordByUserID, params);
  state.currentList = state.record.browsingHistory;
});

// [computed]
const user = computed(() => {
  return state.user;
});

const record = computed(() => {
  return state.record;
});
</script>

<template>
  <div class="container scroll">
    <div class="container__userInfo">
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
      <div class="userInfo__record">
        <div class="record__item" @click="toSpace">
          <span class="item__count">{{ record.treeList?.length || "-" }}</span>
          <span class="item__type">动态</span>
        </div>
        <div class="record__item">
          <span class="item__count">{{ record.following?.length || "-" }}</span>
          <span class="item__type">关注</span>
        </div>
        <div class="record__item">
          <span class="item__count">{{ record.fans?.length || "-" }}</span>
          <span class="item__type">粉丝</span>
        </div>
      </div>
      <div class="space" @click="toSpace">空间 <i class="iconfont icon-youjiantou"></i></div>
    </div>
    <div class="container__main">
      <el-affix :offset="76">
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
      <div class="main__content">
        <div class="content__trees" v-if="state.current < 2">
          <Card v-for="(item, index) in state.currentList" :key="item._id" :tree="item" />
        </div>
        <div class="content__orders" v-else>
          {{ state.currentList }}
          <!-- <OrderCard/> -->
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
  padding: 30px 40px;
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
        justify-content: center;
        grid-template-columns: repeat(auto-fill, 36vmin);
        align-content: flex-start;
      }
    }
  }
}
</style>
