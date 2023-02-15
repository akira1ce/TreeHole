<script setup>
import { onMounted, reactive, ref } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import eventBus from "../lib/eventBus";
import { local } from "../util";

const route = useRoute();
const router = useRouter();

// [state]
const sliderRef = ref();
const loginUser = local.getItem("user") || {};
const subRouting = ["Recommend", "Area"];

const state = reactive({
  current: local.getItem("current_home") || 0,
});

// [methods]
const sliderMove = () => {
  if (state.current == 0) sliderRef.value.style.left = "30px";
  else sliderRef.value.style.left = "100px";
};
/**
 * tab 切换
 * @param {vnode} target
 */
const tabHandler = (target) => {
  // Home -> recommend / area
  state.current = target;
  sliderMove();
  eventBus.emit("switchNav", target);
};

onMounted(() => {
  sliderMove();
});
</script>

<template>
  <!-- 顶部栏 -->
  <div class="topbar">
    <!-- logo -->
    <i class="iconfont icon-Treehouse topbar__logo"></i>
    <div class="topbar__tab" v-show="route.path.startsWith('/home')">
      <!-- 推荐 -->
      <div class="topbar__item" @click="tabHandler(0)" :id="state.current == 0 && 'active'">推荐</div>
      <!-- 地区 -->
      <div class="topbar__item" @click="tabHandler(1)" :id="state.current == 1 && 'active'">
        {{ loginUser.location?.split("-")[1] }}
      </div>
      <!-- 滑块 -->
      <div class="slider" ref="sliderRef"></div>
      <div></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(97, 102, 109);
@activeColor: rgb(94, 161, 97);

// font
@defaultFont: PingFang SC, Microsoft YaHei;

// topbar
@topbar__height: 75px;
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
.topbar {
  .flex__row();
  height: @topbar__height;
  padding: 0 36px;
  border-bottom: 1px solid rgb(241, 242, 243);
  .topbar__logo {
    font-size: 26px;
    color: @activeColor;
  }
  .topbar__tab {
    .flex__row();
    position: relative;
    height: 50%;
    font-size: 17px;
    font-weight: 500;
    font-family: @defaultFont;
    color: @defaultColor;
    padding: 0 24px;
    gap: 36px;
    #active {
      color: @activeColor;
    }
    .topbar__item {
      transition: all 0.5s;
      cursor: pointer;
      &:hover {
        color: @activeColor;
      }
    }
    .slider {
      position: absolute;
      width: 22px;
      height: 4px;
      bottom: 0;
      left: 30px;
      border-radius: 12px;
      background-color: @activeColor;
      transition: all 0.5s;
    }
  }
}
</style>
