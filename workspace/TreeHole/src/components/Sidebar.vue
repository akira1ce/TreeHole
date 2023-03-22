<!--
 * @Author: Akira
 * @Date: 2022-11-15 15:41:20
 * @LastEditTime: 2023-02-28 12:54:24
-->
<script setup>
import { onMounted, ref, toRaw } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { local } from "../util";

const route = useRoute();
const router = useRouter();

const user = local.getItem("user") || {};
const whitelist = ["Home", "Dynamic", "Personal", "Space", "Socket"];

// [methods]
// avator loading errorHandler
const errorHandler = () => true;

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

/**
 * 导航
 * @param {vnode} el
 */
const navigate = (el) => {
  const id = el.target.dataset.id || el.target?.parentNode.dataset.id;
  // back
  if (id == -1) {
    router.go(-1);
    return;
  }
  router.push({ name: whitelist[id] });
};
</script>

<template>
  <!-- 侧边导航 -->
  <div class="sidebar" @click="navigate">
    <!-- 上半部 -->
    <div class="sidebar-top">
      <!-- 返回 -->
      <div class="back" data-id="-1">
        <i class="iconfont icon-zuojiantou"></i>
      </div>
      <!-- 首页 -->
      <div class="home" :id="route.path.startsWith('/home') && 'active'" data-id="0">
        <i class="iconfont icon-shouye"></i>
        <span>首页</span>
      </div>
      <!-- 关注 -->
      <div class="dynamic" :id="route.path.startsWith('/dynamic') && 'active'" data-id="1">
        <i class="iconfont icon-dongtai"></i>
        <span>动态</span>
      </div>
      <!-- 个人中心 -->
      <div class="personal" :id="route.path.startsWith('/personal') && 'active'" data-id="2">
        <i class="iconfont icon-moban"></i>
        <span>我的</span>
      </div>
    </div>
    <!-- 下半部 -->
    <div class="sidebar-bottom">
      <!-- 个人空间 -->
      <div class="avator">
        <img :src="user.avator" data-id="3" @click="toSpace(user)" />
      </div>
      <!-- 聊天 -->
      <div class="socket" :id="route.path.startsWith('Socket') && 'active'" data-id="4">
        <i class="iconfont icon-chat"></i>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(2, 3, 2);
@activeColor: rgb(94, 161, 97);

// font
@defaultFont: PingFang SC, Microsoft YaHei;

// sidebar
@sidebar_width: 65px;
@sidebar_height: 100vh;
@sidebar_backColor: rgb(246, 247, 248);

//iconfont
@icon_fontSize: 26px;

.flex__column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.flex__row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sidebar {
  .flex__column();
  width: @sidebar_width;
  height: @sidebar_height;
  float: left;
  overflow: hidden;
  justify-content: space-between;
  background-color: @sidebar_backColor;
  .iconfont {
    font-size: @icon_fontSize;
  }
  .sidebar-top {
    width: 100%;
    .flex__column();
    justify-content: center;
    gap: 30px;
    .back {
      height: 75px;
      line-height: 75px;
      .iconfont {
        color: @defaultColor;
      }
    }
    .home,
    .dynamic,
    .personal {
      .flex__column();
      width: 100%;
      gap: 7px;
      font-size: 12px;
      font-weight: lighter;
      color: @defaultColor;
      transition: all 0.5s;
      cursor: pointer;
      &:hover {
        color: @activeColor;
      }
    }
  }
  .sidebar-bottom {
    .flex__column();
    justify-content: center;
    gap: 20px;
    margin: 36px 0;
    .avator {
      cursor: pointer;
      img {
        width: 30px;
        border-radius: 30px;
      }
    }
    .socket {
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        color: @activeColor;
      }
    }
  }
  #active {
    color: @activeColor;
  }
}
</style>
