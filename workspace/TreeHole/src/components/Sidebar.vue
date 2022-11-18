<script setup>
import { inject, onMounted, reactive, ref } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import request from "../api/request";
import api from "../api";

const route = useRoute();
const router = useRouter();

const user = ref({});
const _id = localStorage.getItem("_id") || "";

// static state
const whitelist = ["Home", "Dynamic", "Personal", "Space", "Socket"];

// avator loading errorHandler
const errorHandler = () => true;

// update user info
const updateUser = async () => {
  try {
    const res = await request.post(api.user.getUserById, { _id });
    user.value = res;
    console.log(`output-user.value`, user.value);
  } catch (e) {
    console.log(`output->e`, e);
  }
};

// navRouter
const navigate = (el) => {
  const id = el.target.dataset.id || el.target.parentNode.dataset.id;
  if (id == -1) {
    router.go(-1);
    return;
  }
  router.push({ name: whitelist[id] });
};

onMounted(() => {
  updateUser();
});
</script>

<template>
  <div class="sidebar" @click="navigate">
    <div class="sidebar-top">
      <div class="back" data-id="-1">
        <i class="iconfont icon-zuojiantou"></i>
      </div>
      <div class="home" :id="route.name == 'Home' && 'active'" data-id="0">
        <i class="iconfont icon-shouye"></i>
        <span>首页</span>
      </div>
      <div
        class="dynamic"
        :id="route.name == 'Dynamic' && 'active'"
        data-id="1"
      >
        <i class="iconfont icon-dongtai"></i>
        <span>动态</span>
      </div>
      <div
        class="personal"
        :id="route.name == 'Personal' && 'active'"
        data-id="2"
      >
        <i class="iconfont icon-moban"></i>
        <span>我的</span>
      </div>
    </div>
    <div class="sidebar-bottom">
      <div class="avator" data-id="3">
        <el-avatar :src="user.avator" :size="28" @error="errorHandler" />
      </div>
      <div class="socket" :id="route.name == 'Socket' && 'active'" data-id="4">
        <i class="iconfont icon-chat"></i>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
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

//color
@defaultColor: rgb(2, 3, 2);
@activeColor: rgb(94, 161, 97);

// sidebar
@sidebar_width: 5.417vw;
@sidebar_height: 100vh;
@sidebar_backColor: rgb(246, 247, 248);

//iconfont
@icon_fontSize: 2.2vw;
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
    gap: 2.5vw;
    .back {
      height: 6.25vw;
      line-height: 6.25vw;
      .iconfont {
        color: @defaultColor;
      }
    }
    .home,
    .dynamic,
    .personal {
      .flex__column();
      width: 100%;
      gap: 0.6vw;
      font-size: 0.5vw;
      font-weight: lighter;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      user-select: none;
      color: @defaultColor;
      transition: all 0.2s;
      &:hover {
        color: @activeColor;
      }
    }
  }
  .sidebar-bottom {
    .flex__column();
    justify-content: center;
    gap: 1.667vw;
    margin: 3vw 0;
    .avator {
      user-select: none;
    }
    .socket {
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
