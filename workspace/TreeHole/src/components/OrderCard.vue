<script setup>
import { Delete } from "@element-plus/icons-vue";
import { computed, defineProps, toRaw } from "vue-demi";
import { useRouter } from "vue-router";
import { local } from "../util";

const router = useRouter();

// [props]
const props = defineProps(["order", "deleteOrder"]);

// [state]
const { order, deleteOrder, index } = props;
const user = local.getItem("user");

// [methods]
const toSpace = (spaceUser) => {
  spaceUser = toRaw(spaceUser);
  router.push({ name: "Space", state: { spaceUser } });
};

// [computed]
const otherSide = computed(() => {
  return user._id == order.buyerID ? order.seller : order.buyer;
});

const tag = computed(() => {
  return order.tree.state == 0 ? { status: "warning", content: "进行中" } : { status: "success", content: "已完成" };
});
</script>

<template>
  <div class="order">
    <div class="order__otherSide" @click="toSpace(otherSide)">
      <img class="otherSide__avator" :src="otherSide.avator" alt="" />
      <span class="otherSide_name">{{ otherSide.name }}</span>
    </div>
    <div class="order__tree">
      <img class="tree__cover" :src="order.tree.imgs[0]" alt="" />
      <span class="tree__title">{{ order.tree.title }}</span>
    </div>

    <span>{{ order.tree.time }}</span>
    <el-tag :type="tag.status">{{ tag.content }}</el-tag>
    <div class="order-btns">
      <el-button round>联系树友</el-button>
      <el-button class="order-delete" type="danger" :icon="Delete" circle @click="deleteOrder(order._id, index)" />
    </div>
  </div>
</template>

<style lang="less" scoped>
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
.order {
  .flex__row();
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  .order__otherSide {
    .flex__row();
    align-items: center;
    cursor: pointer;
    .otherSide__avator {
      width: 40px;
      border-radius: 100px;
      margin-right: 20px;
      cursor: pointer;
    }
  }

  .order__tree {
    .flex__row();
    flex: 0.5;
    align-items: center;
    cursor: pointer;
    .tree__cover {
      width: 100px;
      margin-right: 20px;
    }
    .tree__title {
      max-width: 250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .order-btns {
    .order-delete {
      visibility: hidden;
    }
  }

  &:hover {
    .order-delete {
      visibility: visible;
    }
  }
}
</style>
