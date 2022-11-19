<script setup>
import { reactive, defineProps } from "vue-demi";

const props = defineProps(["tree"]);
const tree = props.tree;
</script>

<template>
  <div class="card" :key="tree._id">
    <img class="card__cover" :src="tree.imgs[0]" />
    <div class="card__title">{{ tree.title }}</div>
    <div class="card__author">
      <i class="iconfont icon-shuye"></i> {{ `${tree.owner} · ${tree.time}` }}
    </div>
  </div>
</template>

<style lang="less" scoped>
//font
@defaultFont: PingFang SC, Microsoft YaHei;

//color
@defaultColor: rgb(155, 161, 166);
@activeColor: rgb(94, 161, 97);

.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}
.card {
  .flex__column();
  width: 20vw;
  height: 15.833vw;
  margin: 1.25vw 0.85vw;
  position: relative;
  font-family: @defaultFont;
  .card__cover {
    width: 100%;
    height: 11.667vw;
    border-radius: 0.5vw;
    transition: all 0.5s;
    cursor: pointer;
    &:hover {
      transform: scale(1.05);
    }
  }
  .card__title {
    margin: 0.833vw 0;
    font-size: 1.25vw;
    cursor: pointer;
  }
  .card__author {
    .flex__row();
    align-items: center;
    font-size: 1.083vw;
    color: @defaultColor;
    cursor: pointer;
    .icon-shuye {
      font-size: 1.333vw;
      margin-right: 0.333vw;
      color: @activeColor;
    }
  }
  .card__title,
  .card__author {
    transition: all 0.5s;
    &:hover {
      color: @activeColor;
    }
  }
}
</style>
