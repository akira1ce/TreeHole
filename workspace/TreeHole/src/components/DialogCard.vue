<script setup>
import { computed } from "vue-demi";
import { local } from "../util";

// [props]
const props = defineProps(["tree", "loginUser", "otherSide", "toSpace", "orderOp"]);
const { tree, loginUser, otherSide, toSpace, orderOp } = props;
// [computed]
const orderBtn = computed(() => {
  let type = "";
  let content = "";
  let code = -1;
  if (tree.ownerID == loginUser._id) {
    if (tree.state == 0) {
      type = "warning";
      content = "等待购买";
    } else if (tree.state == 1) {
      type = "warning";
      content = "确认售出";
      code = 1;
    } else if (tree.state == 2) {
      type = "success";
      content = "售出成功";
    }
  } else {
    if (tree.state == 0) {
      type = "warning";
      content = "立即购买";
      code = 0;
    } else if (tree.state == 1) {
      type = "warning";
      content = "等待出售";
    } else if (tree.state == 2) {
      type = "success";
      content = "购买成功";
    }
  }
  return { type, content, code };
});
</script>

<template>
  <div class="card">
    <div class="card__tree">
      <div class="tree__cover">
        <img :src="tree.imgs[0]" />
      </div>
      <div class="tree__info">
        <span
          class="info__title"
          @click="
            () => {
              if (tree.ownerID == loginUser._id) toSpace(loginUser, tree._id);
              else toSpace(otherSide, tree._id);
            }
          "
          >{{ tree.title }}</span
        >
        <span class="info__describe">{{ tree.describe }}</span>
      </div>
      <div class="tree__options">
        <span class="options__price">￥{{ tree.price }}</span>
        <el-button :type="orderBtn.type" round @click="orderOp(tree, orderBtn.code)">{{ orderBtn.content }}</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
  align-items: center;
  align-self: center;
  width: 550px;
  max-height: 155px;
  font-family: inherit;
  .card__tips {
    padding-top: 20px;
  }
  .card__tree {
    .flex__row();
    gap: 15px;
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    .tree__cover {
      img {
        width: 180px;
      }
    }
    .tree__info {
      .info__title {
        cursor: pointer;
      }
      .flex__column();
      flex: 1;
      gap: 10px;
      justify-content: flex-start;
      font-size: 18px;
      .info__describe {
        font-size: 16px;
        color: grey;
      }
    }
    .tree__options {
      .flex__column();
      align-items: center;
      justify-content: space-between;
      .options__price {
        font-weight: bold;
        color: rgb(255, 75, 75);
      }
    }
  }
}
</style>
