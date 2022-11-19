<script setup>
import { onMounted, ref } from "vue-demi";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// state
const sliderRef = ref();
const user = JSON.parse(localStorage.getItem("user"));
const current = localStorage.getItem("current");
const subRouting = ["Recommend", "Area"];

// methods
const tabHandler = (target) => {
  if (target == "Recommend") {
    localStorage.setItem("current", 0);
    sliderRef.value.style.left = "2.5vw";
  } else if (target == "Area") {
    localStorage.setItem("current", 1);
    sliderRef.value.style.left = "8.3vw";
  }
  router.push({
    name: target,
  });
};

onMounted(async () => {
  tabHandler(subRouting[current]);
});
</script>

<template>
  <div class="topbar">
    <i class="iconfont icon-Treehouse topbar__logo"></i>
    <div class="topbar__tab" v-show="route.path.startsWith('/home')">
      <div
        class="topbar__item"
        @click="tabHandler('Recommend')"
        :id="route.path.endsWith('/recommend') && 'active'"
      >
        推荐
      </div>
      <div
        class="topbar__item"
        @click="tabHandler('Area')"
        :id="route.path.endsWith('/area') && 'active'"
      >
        {{ user.location?.split("-")[1] }}
      </div>
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
  height: 6.2vw;
  padding: 0 3vw;
  border-bottom: 1px solid rgb(241, 242, 243);
  .topbar__logo {
    font-size: 2.2vw;
    color: @activeColor;
  }
  .topbar__tab {
    .flex__row();
    position: relative;
    height: 50%;
    font-size: 1.4vw;
    font-weight: 500;
    font-family: @defaultFont;
    color: @defaultColor;
    padding: 0 2vw;
    gap: 3vw;
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
      width: 1.8vw;
      height: 0.3vw;
      bottom: 0;
      left: 2.5vw;
      border-radius: 1vw;
      background-color: @activeColor;
      transition: all 0.5s;
    }
  }
}
</style>
