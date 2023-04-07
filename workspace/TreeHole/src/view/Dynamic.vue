<!--
 * @Author: Akira
 * @Date: 2022-11-16 16:36:37
 * @LastEditTime: 2023-04-07 14:41:00
-->
<script setup>
import api from "../api";
import request from "../api/request";
import { computed, onMounted, reactive, ref } from "vue-demi";
import { local, defaultState, recordHandle } from "../util";
import TreeCard from "../components/TreeCard.vue";
import { ElMessage } from "element-plus";

const state = reactive({
  /** 当前选中用户 */
  current: 0,
  record: defaultState.record,
  /** 关注列表 */
  userList: [],
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
 * 收藏树
 * @param {string} treeID
 */
const collectHandle = (tree) => {
  recordHandle.collect(state.record, state.user._id, tree._id);
};

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
  const userID = state.userList[current]?._id;

  if (userID) {
    const baseStatus = userID == state.user._id ? -1 : 0;
    const { list } = await request.post(api.tree.getTreeListByUserID, { userID, pageNo, limit, baseStatus });

    if (list.length < state.limit_tree) state.infiniteScroll_tree = true;
    state.treeList.push(...list);
    state.pageNo_tree++;
  }
};

/** 获取用户列表 */
const getUserList = async () => {
  const { pageNo_user, limit_user, record } = state;
  const pageNo = pageNo_user;
  const limit = limit_user;

  const { list } = await request.post(api.user.getUserListByID, { users: record.following, pageNo, limit });
  list.forEach((item) => (item.isFollow = true));

  if (list.length == 0) {
    state.infiniteScroll_user = true;
    /** 在所有数据加载完毕之后，判断是否存在失效数据，存在 -> 更新记录 */
    if (state.userList.length < record.following.length) {
      record.following = state.userList.map((item) => item._id);
      await request.post(api.record.modifyByID, record);
    }
  }
  state.userList.push(...list);
  state.pageNo_user++;
};

/** 关注-取消关注 */
const followHandle = async () => {
  const { current, user } = state;
  const follow_current = state.userList[current];

  const userID1 = user._id;
  const userID2 = follow_current._id;
  await request.post(api.record.modifyRecordUser, { userID1, userID2 });

  // 更新缓存
  follow_current.isFollow = !follow_current.isFollow;
  if (follow_current.isFollow) ElMessage.success("关注成功");
  else ElMessage.success("取消关注成功");
};

// 当前用户
const currentUser = computed(() => {
  return state.userList[state.current];
});

const isEmpty_user = computed(() => {
  return state.userList.length == 0;
});

const isEmpty_tree = computed(() => {
  return state.treeList.length == 0;
});

onMounted(async () => {
  try {
    const userID = state.user._id;
    state.record = await request.post(api.record.getRecordByUserID, { userID });

    await getUserList();
    await getTreeList();
  } catch (error) {
    ElMessage.error(error.message);
  }
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
      <div class="follow__item" :id="state.current == index && 'active'" :data-id="index" :key="item._id" v-for="(item, index) in state.userList">
        <img :src="item.avator" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 树列表 -->
    <div class="container__content scroll" v-infinite-scroll="getTreeList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll_tree" v-loading="state.isLoading">
      <el-empty class="center" v-if="isEmpty_tree" description="他好像没有发布苗木~"></el-empty>
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
