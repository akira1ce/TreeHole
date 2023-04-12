<!--
 * @Author: Akira
 * @Date: 2022-11-16 16:36:37
 * @LastEditTime: 2023-04-12 11:49:22
-->
<script setup>
import { computed, onMounted, reactive } from "vue-demi";
import TreeCard from "../components/TreeCard.vue";
import { ElMessage } from "element-plus";
import request from "../api/request";
import { local } from "../util";
import api from "../api";

const state = reactive({
  /** 当前选中用户 */
  current: 0,
  /** 关注列表 */
  followList: [],
  /** 苗木列表 */
  treeList: [],
  user: local.getItem("user"),
  /** 苗木分页 */
  pageNo_tree: 1,
  limit_tree: 4,
  infiniteScroll_tree: false,
  /** 用户分页 */
  pageNo_user: 1,
  limit_user: 12,
  infiniteScroll_user: false,
  isLoading: true,
});

/**
 * 选择关注列表中的用户
 * @param {vnode} e
 */
const selectUser = (e) => {
  const id = e.target.dataset?.id || e.target.parentNode.dataset?.id;
  if (state.current == id || id == undefined) return;
  state.current = id;
  state.treeList = [];
  state.pageNo_tree = 1;
  state.infiniteScroll_tree = false;
  getTreeList();
};

/** 获取树列表 */
const getTreeList = async () => {
  const { pageNo_tree, limit_tree, current } = state;
  const pageNo = pageNo_tree;
  const limit = limit_tree;
  const userID = state.followList[current]?.toUserID;
  if (userID) {
    const { list } = await request.post(api.tree.getTreeListByUserID, { userID, pageNo, limit, baseStatus: -1 });
    if (list.length == 0) state.infiniteScroll_tree = true;
    state.treeList.push(...list);
    state.pageNo_tree++;
  }
};

/** 获取用户列表 */
const getUserList = async () => {
  const { pageNo_user, limit_user } = state;
  const pageNo = pageNo_user;
  const limit = limit_user;

  const { list } = await request.post(api.follow.getFollowList, { fromUserID: state.user._id, pageNo, limit });
  list.forEach((item) => (item.isFollow = true));

  if (list.length == 0) state.infiniteScroll_user = true;

  state.followList.push(...list);
  state.pageNo_user++;
};

const isEmpty_user = computed(() => {
  return state.followList.length == 0;
});

const isEmpty_tree = computed(() => {
  return state.treeList.length == 0;
});

onMounted(async () => {
  await getUserList();
  await getTreeList();
  setTimeout(() => {
    state.isLoading = false;
  }, 500);
});
</script>

<template>
  <div class="container">
    <!-- 关注列表 -->
    <div class="container__follow scroll" v-infinite-scroll="getUserList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll_user" @click="selectUser">
      <div v-if="isEmpty_user">
        <span>你还没有关注任何人喔~</span>
      </div>
      <div class="follow__item" :id="state.current == index && 'active'" :data-id="index" :key="item._id" v-for="(item, index) in state.followList">
        <img :src="item.toUser.avator" />
        <span>{{ item.toUser.name }}</span>
      </div>
    </div>
    <!-- 树列表 -->
    <div class="container__content scroll" v-infinite-scroll="getTreeList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll_tree" v-loading="state.isLoading">
      <el-empty class="center" v-if="isEmpty_tree" description="他好像没有发布苗木~"></el-empty>
      <div class="content__treeList">
        <TreeCard v-for="(item, index) in state.treeList" :key="item._id" :tree="item"></TreeCard>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(241, 242, 243);
@deepDefaultColor: rgb(227, 229, 231);
@activeColor: rgb(94, 161, 97);

.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}

.container {
  .flex__row();
  height: calc(100vh - 76px);
  overflow: hidden;
  position: relative;
  background-color: @defaultColor;
  .container__follow {
    .flex__column();
    width: 230px;
    height: 100%;
    padding: 25px 15px;
    background-color: white;
    overflow-y: overlay;
    .follow__item {
      .flex__row();
      align-items: center;
      padding: 10px 15px;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.5s;
      img {
        width: 36px;
        border-radius: 36px;
        margin-right: 12px;
      }
      &:hover {
        background-color: @deepDefaultColor;
      }
    }
    #active {
      background-color: @defaultColor;
    }
  }
  .container__content {
    .flex__row();
    flex: 1;
    justify-content: center;
    overflow-y: overlay;
    position: relative;
    height: 100%;
    .content__treeList {
      .flex__column();
      padding: 5px 0;
      align-items: center;
      width: 68%;
      height: fit-content;
      position: relative;
      gap: 5px;
      .unFollow {
        font-size: 14px;
        padding: 10px;
        color: @activeColor;
        cursor: pointer;
        background-color: rgba(94, 161, 97, 0.11);
        border-radius: 8px;
        transition: all 0.3s;
        &:hover {
          color: white;
          background-color: @activeColor;
        }
      }
    }
  }
}
</style>
