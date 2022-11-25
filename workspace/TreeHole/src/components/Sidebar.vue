<script setup>
import { onMounted, ref } from "vue-demi";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// [state]
const user = JSON.parse(localStorage.getItem("user"));

// static state
const whitelist = ["Home", "Dynamic", "Personal", "Space", "Socket"];

// [methods]
// avator loading errorHandler
const errorHandler = () => true;

// navRouter
const navigate = (el) => {
  const id = el.target.dataset.id || el.target?.parentNode.dataset.id;
  // back
  if (id == -1) {
    router.go(-1);
    return;
  }
  // Home
  if (id == 0) {
    const current = localStorage.getItem("current") || 0;
    const subRouting = ["Recommend", "Area"];
    router.push({ name: subRouting[current] });
    return;
  }
  router.push({ name: whitelist[id] });
};
</script>

<template>
  <div class="sidebar" @click="navigate">
    <div class="sidebar-top">
      <div class="back" data-id="-1">
        <i class="iconfont icon-zuojiantou"></i>
      </div>
      <div
        class="home"
        :id="route.path.startsWith('/home') && 'active'"
        data-id="0"
      >
        <i class="iconfont icon-shouye"></i>
        <span>首页</span>
      </div>
      <div
        class="dynamic"
        :id="route.path.startsWith('/dynamic') && 'active'"
        data-id="1"
      >
        <i class="iconfont icon-dongtai"></i>
        <span>动态</span>
      </div>
      <div
        class="personal"
        :id="route.path.startsWith('/personal') && 'active'"
        data-id="2"
      >
        <i class="iconfont icon-moban"></i>
        <span>我的</span>
      </div>
    </div>
    <div class="sidebar-bottom">
      <div class="avator">
        <img :src="user.avator" data-id="3" />
      </div>
      <div
        class="socket"
        :id="route.path.startsWith('Socket') && 'active'"
        data-id="4"
      >
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
      font-size: 6px;
      font-weight: lighter;
      font-family: @defaultFont;
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
