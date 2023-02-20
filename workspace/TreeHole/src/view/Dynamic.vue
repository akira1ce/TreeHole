<!--
 * @Author: Akira
 * @Date: 2022-11-16 16:36:37
 * @LastEditTime: 2023-02-20 16:05:34
-->
<script setup>
import api from "../api";
import request from "../api/request";
import { computed, onMounted, reactive, ref } from "vue-demi";
import { local, defaultState, recordHandle } from "../util";
import TreeCard from "../components/TreeCard.vue";
import { ElMessage } from "element-plus";

const state = reactive({
  current: 0,
  record: defaultState.record,
  userList: [],
  treeList: [],
  user: local.getItem("user"),
  pageNo_tree: 1,
  pageNo_user: 1,
  limit_tree: 4,
  limit_user: 12,
  infiniteScroll_tree: false,
  infiniteScroll_user: false,
  isEmpty_user: false,
  isEmpty_tree: false,
});

// [methods]
/**
 * 收藏树
 * @param {string} treeID
 */
const collectHandle = (tree) => {
  recordHandle.collect(state.record, state.user._id, tree._id);
};

const errorHandler = () => true;

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

/**
 * 获取树列表
 */
const getTreeList = async () => {
  const { pageNo_tree, limit_tree, current } = state;
  const pageNo = pageNo_tree;
  const limit = limit_tree;
  const userID = state.userList[current]?._id;
  if (userID) {
    const trees = await request.post(api.tree.getTreeListByUserID, { userID, pageNo, limit });
    if (trees.length < state.limit_tree) state.infiniteScroll_tree = true;
    state.treeList.push(...trees);
    state.pageNo_tree++;
  }
};

/**
 * 获取用户列表
 */
const getUserList = async () => {
  const { pageNo_user, limit_user, record } = state;
  const pageNo = pageNo_user;
  const limit = limit_user;

  const users = await request.post(api.user.getUserListByID, { users: record.following, pageNo, limit });
  users.forEach((item) => (item.isFollow = true));

  if (users.length < state.limit_user) state.infiniteScroll_user = true;
  state.userList.push(...users);
  state.pageNo_user++;
};

/**
 * 关注-取消关注
 */
const followHandle = async () => {
  const { current, record, user } = state;
  const follow_current = state.userList[current];

  const userID1 = user._id;
  const userID2 = follow_current._id;
  await request.post(api.record.modifyRecordUser, { userID1, userID2 });

  // 更新缓存
  follow_current.isFollow = !follow_current.isFollow;
  if (follow_current.isFollow) ElMessage.success("关注成功");
  else ElMessage.success("取消关注成功");
};

// [computed]
// 当前用户
const currentUser = computed(() => {
  return state.userList[state.current];
});

// 当前关注用户树列表
const treeList = computed(() => {
  return state.treeList;
});

onMounted(async () => {
  const userID = state.user._id;
  state.record = await request.post(api.record.getRecordByUserID, { userID });
  await getUserList();
  await getTreeList();
  if (state.userList.length == 0) state.isEmpty_user = true;
  if (state.treeList.length == 0) state.isEmpty_tree = true;
});
</script>

<template>
  <div class="container">
    <!-- 关注列表 -->
    <div class="container__follow scroll" v-infinite-scroll="getUserList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll_user" @click="selectUser">
      <div v-if="state.isEmpty_user">
        <span>你还没有关注任何人!</span>
      </div>
      <div class="follow__item" :id="state.current == index && 'active'" :data-id="index" :key="item._id" v-for="(item, index) in state.userList">
        <img :src="item.avator" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 树列表 -->
    <div class="container__content scroll" v-infinite-scroll="getTreeList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll_tree">
      <el-empty class="center" v-if="state.isEmpty_tree" description="他好像没有发布苗木~"></el-empty>
      <div class="content__treeList">
        <TreeCard v-for="(item, index) in state.treeList" :key="item._id" :tree="item" :record="state.record" :collectHandle="collectHandle">
          <div class="unFollow" @click="followHandle">
            {{ currentUser.isFollow ? "取消关注" : "关注" }}
          </div>
        </TreeCard>
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
      align-items: center;
      width: 68%;
      height: fit-content;
      position: relative;
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
