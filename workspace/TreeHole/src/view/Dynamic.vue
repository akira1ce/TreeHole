<script setup>
import api from "../api";
import request from "../api/request";
import { computed, onMounted, reactive, ref } from "vue-demi";
import { local, defaultState, recordHandle } from "../util";
import TreeCard from "../components/TreeCard.vue";
import { ElMessage } from "element-plus";

// [state]
const state = reactive({
  current: 0,
  record: defaultState.record,
  followList: [],
  treeList: [],
  user: local.getItem("user"),
  pageNo: 1,
  limit: 2,
  infiniteScroll: false,
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
  state.pageNo = 1;
  state.infiniteScroll = false;
  getTreeList();
};

/**
 * 获取树列表
 */
const getTreeList = async () => {
  const { pageNo, limit, current } = state;
  const userID = state.followList[current]?._id;
  if (userID) {
    const trees = await request.post(api.tree.getTreeListByUserID, { userID, pageNo, limit });
    if (trees.length < state.limit) state.infiniteScroll = true;
    state.treeList.push(...trees);
    state.pageNo++;
  }
};

/**
 * 关注-取消关注
 */
const followHandle = async () => {
  const { current, record, user } = state;
  const follow_current = state.followList[current];

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
  return state.followList[state.current];
});

// 当前关注用户树列表
const treeList = computed(() => {
  return state.treeList;
});

onMounted(async () => {
  const userID = state.user._id;
  state.record = await request.post(api.record.getRecordByUserID, { userID });
  state.followList = await request.post(api.user.getUserListByID, { users: state.record.following });
  state.followList.forEach((item) => (item.isFollow = true));
  getTreeList();
});
</script>

<template>
  <div class="container">
    <!-- 关注列表 -->
    <div class="container__follow" @click="selectUser">
      <div class="follow__item" :id="state.current == index && 'active'" :data-id="index" :key="item._id" v-for="(item, index) in state.followList">
        <img :src="item.avator" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 树列表 -->
    <div class="container__content scroll" v-infinite-scroll="getTreeList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
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
    justify-content: center;
    overflow-y: auto;
    flex: 1;
    .content__treeList {
      .flex__column();
      width: 68%;
      height: fit-content;
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
