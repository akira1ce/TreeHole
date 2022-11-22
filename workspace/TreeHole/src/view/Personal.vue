<script setup>
import api from "../api";
import request from "../api/request";
import Card from "../components/Card.vue";
import { computed, onMounted, reactive, ref } from "vue-demi";
import { useRouter } from "vue-router";

const router = useRouter();
const sliderRef = ref();
// [state]
const state = reactive({
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
  },
  treeList: [],
  user: JSON.parse(localStorage.getItem("user")),
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
};

onMounted(async () => {
  let params = { userID: state.user._id };
  state.record = await request.post(api.record.getRecordByUserID, params);
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
  <div class="container">
    <div class="container__userInfo">
      <div class="userInfo__base">
        <div class="base__avator" @click="toSpace">
          <img class="avator" :src="user.avator" alt="" />
        </div>
        <div class="base__info">
          <div class="info__name">{{ user.name }}</div>
          <div class="info__location">
            <el-tag
              class="location__tag"
              type="success"
              v-for="item in user.location.split('-')"
              >{{ item }}</el-tag
            >
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
      <div class="space" @click="toSpace">
        空间 <i class="iconfont icon-youjiantou"></i>
      </div>
    </div>
    <div class="container__main">
      <div class="main__navMenu">
        <div
          v-for="(item, index) in navMenu"
          class="navMenu__item"
          :class="{ active: state.current == index }"
          @click="switchNav(index)"
        >
          {{ item }}
        </div>
        <div class="navMenu__slider" ref="sliderRef"></div>
      </div>
      <div class="main__content">
        {{ record.browsingHistory }}
        <!-- <Card /> -->
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
        span {
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
    .main__navMenu {
      .flex__row();
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
    }
  }
}
</style>
