<script setup>
import { defineProps, toRaw } from "vue-demi";
import { useRouter } from "vue-router";

const router = useRouter();

// [props]
const props = defineProps(["tree"]);
const tree = props.tree;

// [methods]
const toSpace = (spaceUser, treeID) => {
  spaceUser = toRaw(spaceUser);
  router.push({ name: "Space", state: { spaceUser, treeID } });
};
</script>

<template>
  <div class="card">
    <img class="card__cover" :src="tree.imgs[0]" @click="toSpace(tree.owner, tree._id)" />
    <div class="card__title">{{ tree.title }}</div>
    <div class="card__author" @click="toSpace(tree.owner)"><i class="iconfont icon-shuye"></i> {{ `${tree.owner.name} · ${tree.time.split(" ")[0]}` }}</div>
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
  margin: 15px 10px;
  position: relative;
  font-family: @defaultFont;
  .card__cover {
    width: 34vmin;
    height: 100%;
    border-radius: 6px;
    transition: all 0.5s;
    cursor: pointer;
    &:hover {
      transform: scale(1.05);
    }
  }
  .card__title {
    margin: 10px 0;
    font-size: 15px;
    cursor: pointer;
  }
  .card__author {
    .flex__row();
    align-items: center;
    font-size: 13px;
    color: @defaultColor;
    cursor: pointer;
    .icon-shuye {
      font-size: 16px;
      margin-right: 4px;
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
