<script setup>
import api from "../api";
import request from "../api/request";
import { computed, onMounted, reactive, ref } from "vue-demi";
import { local, defaultState } from "../util";
import TreeCard from "../components/TreeCard.vue";

// [state]
const state = reactive({
  current: 0,
  record: defaultState.record,
  following: [],
  followTree: [],
  user: local.getItem("user"),
});

// [methods]
// 收藏
const collectHaddle = async (treeID) => {
  const record = state.record;
  const userID = state.user._id;
  const params = {
    userID,
    treeID,
    mode: 1,
  };
  await request.post(api.record.modifyRecordTree, params);
};

const errorHandler = () => true;

// select user in userList (Left)
const selectUser = async (e) => {
  const id = e.target.dataset?.id || e.target.parentNode.dataset?.id;
  if (state.current == id || id == undefined) return;
  state.current = id;
  await getTreeList(state.current);
};

const getTreeList = async (index) => {
  state.followTree = await request.post(api.tree.getTreeListByUserID, {
    userID: state.record.followList[index]?._id,
  });
};

// follow
const switchFollow = async () => {
  const index = state.current;
  const follow_index = state.record.followList[index];
  const params = {
    userID1: state.user._id,
    userID2: follow_index._id,
  };
  // update follow status
  follow_index.isFollow = !follow_index.isFollow;
  await request.post(api.record.modifyRecordUser, params);
};

// [computed]
const currentUser = computed(() => {
  return state.record.followList[state.current];
});

const followTree = computed(() => {
  return state.followTree;
});

onMounted(async () => {
  const userID = state.user._id;
  state.record = await request.post(api.record.getRecordByUserID, { userID });
  state.record.followList.forEach((item) => (item.isFollow = true));
  // getTreeList
  getTreeList(0);
});
</script>

<template>
  <div class="container">
    <div class="container__follow" @click="selectUser">
      <div class="follow__item" :id="state.current == index && 'active'" :data-id="index" :key="item._id" v-for="(item, index) in state.record.followList">
        <img :src="item.avator" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="container__content scroll">
      <div class="content__treeList">
        <TreeCard v-for="(item, index) in state.followTree" :key="item._id" :tree="item" :record="state.record" :collectHaddle="collectHaddle">
          <div class="unFollow" @click="switchFollow">
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
