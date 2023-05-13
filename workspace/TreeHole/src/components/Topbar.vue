<!--
 * @Author: Akira
 * @Date: 2022-11-15 15:41:39
 * @LastEditTime: 2023-05-13 10:41:51
-->
<script setup>
import { onMounted, reactive, ref } from "vue-demi";
import { Search } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import eventBus from "../lib/eventBus";
import { local } from "../util";

const route = useRoute();

const sliderRef = ref();
const tabLeftRef = ref();
const tabRightRef = ref();
const loginUser = local.getItem("user") || {};

const state = reactive({
  current: local.getItem("current_home") || 0,
  searchContent: "",
});

// 滑块移动
const sliderMove = () => {
  if (state.current == 0) sliderRef.value.style.left = "30px";
  else sliderRef.value.style.left = "108px";
};

/**
 * tab 切换
 * @param {object} target
 */
const tabHandler = (target) => {
  // Home -> recommend / area
  state.current = target;
  sliderMove();
  eventBus.emit("switchNav", target);
};

/** 搜索 */
const handleSearch = (searchContent) => {
  eventBus.emit("search", searchContent);
};

/** 清空搜索 */
const clearSearch = () => {};

const handleSearchFocus = () => {
  tabLeftRef.value.style.opacity = 0;
  tabRightRef.value.style.marginRight = "25.787vw";
  tabRightRef.value.style.width = "400px";
};

const handleSearchBlur = () => {
  if (state.searchContent == "") {
    tabLeftRef.value.style.opacity = 1;
    tabRightRef.value.style.marginRight = "0";
    tabRightRef.value.style.width = "250px";

    tabHandler(0);
  }
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
      <div class="tab__left" ref="tabLeftRef">
        <!-- 推荐 -->
        <div class="left__item" @click="tabHandler(0)" :id="state.current == 0 && 'active'">推荐</div>
        <!-- 地区 -->
        <div class="left__item" @click="tabHandler(1)" :id="state.current == 1 && 'active'">
          {{ loginUser.location?.split("-")[1] }}
        </div>
        <!-- 滑块 -->
        <div class="slider" ref="sliderRef"></div>
      </div>
      <div class="tab__right" ref="tabRightRef">
        <el-input
          v-model="state.searchContent"
          size="large"
          placeholder="搜索你感兴趣的苗木类型"
          :suffix-icon="Search"
          @keyup.enter="handleSearch(state.searchContent)"
          clearable
          @clear="clearSearch"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        />
      </div>
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
    flex: 1;
    justify-content: space-between;
    position: relative;
    height: 50%;
    font-size: 17px;
    font-weight: 500;
    color: @defaultColor;
    padding: 0 24px;
    gap: 36px;
    #active {
      color: @activeColor;
    }
    .tab__left {
      display: flex;
      gap: 35px;
      transition: all 0.3s;
      .left__item {
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
    .tab__right {
      width: 250px;
      margin-right: 0;
      transition: all 0.3s;
      :deep(.el-input) {
        .el-input__wrapper {
          border-radius: 10px;
          background-color: rgb(241, 242, 243);
          color: rgb(185, 164, 167);
          transition: all 0.3s;
          &:hover {
            background-color: rgb(227, 229, 231);
          }
        }
      }
    }
  }
}
</style>
