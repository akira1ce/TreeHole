<script setup>
import api from "../api";
import request from "../api/request";
import { computed, nextTick, onMounted, reactive, ref } from "vue-demi";
import { local, defaultState } from "../util";
import TreeCard from "../components/TreeCard.vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

// [state]
const loginUser = local.getItem("user");
const user = history.state.spaceUser || loginUser;
const treeID = history.state.treeID || undefined;
const state = reactive({
  record: defaultState.record,
  isFollow: false,
});

// [methods]
// 关注 || 粉丝
const toRecord = () => {
  if (isCurrentUser.value) router.push({ name: "Record" });
};

const handleCommand = (command) => {
  console.log(`output->command`, command);
};

// follow
const switchFollow = async () => {
  state.isFollow = !state.isFollow;
  const { fans, fansList } = state.record;
  const params = {
    userID1: loginUser._id,
    userID2: user._id,
  };
  await request.post(api.record.modifyRecordUser, params);
  // 更新缓存
  if (state.isFollow) {
    fans.push(loginUser._id);
    fansList.push(loginUser);
  } else {
    const index = fans.indexOf(loginUser._id);
    if (index != -1) {
      fans.splice(index, 1);
      fansList.splice(index, 1);
    }
  }
};

// [computed]
const record = computed(() => state.record);

const isCurrentUser = computed(() => {
  return user._id == loginUser._id;
});

onMounted(async () => {
  let params = { userID: user._id };
  state.record = await request.post(api.record.getRecordByUserID, params);
  if (!isCurrentUser.value) state.isFollow = state.record.fans.indexOf(loginUser._id) != -1;
  
  // 滚动条行为
  nextTick(() => {
    const mainRef = document.getElementsByClassName("el-card");
    if (treeID) {
      let targetTree = 0;
      state.record.treeList.forEach((item, index) => {
        if (item._id == treeID) targetTree = index;
      });
      mainRef[targetTree].scrollIntoView({ block: "center" });
    }
  });
});
</script>

<template>
  <div class="container scroll">
    <div class="container__top">
      <div class="top__cover"></div>
      <div class="top__user">
        <span class="user__name">{{ user.name }}</span>
        <div class="user__record">
          <div class="record__item" @click="toRecord">
            <span class="item__count">{{ record.following?.length || "-" }}</span>
            <span class="item__type">关注</span>
          </div>
          <div class="record__item" @click="toRecord">
            <span class="item__count">{{ record.fans?.length || "-" }}</span>
            <span class="item__type">粉丝</span>
          </div>
        </div>
      </div>
      <img class="avator" :src="user.avator" />
      <el-button class="editUserInfo" v-if="isCurrentUser">编辑个人资料</el-button>
      <div class="unFollow" @click="switchFollow" v-else>
        {{ state.isFollow ? "取消关注" : "关注" }}
      </div>
    </div>
    <div class="container__main">
      <div class="release" v-if="isCurrentUser">发布🙌</div>
      <el-empty description="description" v-if="state.record.treeList.length == 0" />
      <TreeCard v-for="(item, index) in state.record.treeList" :tree="item" :user="user" :key="item._id">
        <el-dropdown trigger="click" @command="handleCommand" v-if="isCurrentUser">
          <span class="el-dropdown-link"><i class="iconfont icon-gengduo"></i></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Edit" command="0">编辑</el-dropdown-item>
              <el-dropdown-item :icon="Delete" command="1">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </TreeCard>
    </div>
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(155, 161, 166);
@activeColor: rgb(94, 161, 97);

// calc sidebar topbar
@sidebar_width: 65px;
@topbar_height: 75px;

.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}
.container {
  height: calc(100vh - @topbar_height);
  overflow-y: auto;
  position: relative;
  .container__top {
    .flex__column();
    height: 300px;
    position: relative;
    .top__cover {
      width: 100%;
      height: 70%;
      background: url("../assets/spaceBack.png");
      background-position: bottom;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: cover;
    }
    .top__user {
      .flex__row();
      flex: 1;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      .user__name {
        font-size: 20px;
        font-weight: bold;
        margin-left: calc(2.5vw + 130px);
        padding-top: 15px;
        align-self: flex-start;
      }
      .user__record {
        .flex__row();
        margin-right: 4.167vw;
        .record__item {
          .flex__column();
          align-items: center;
          margin: 0 20px;
          cursor: pointer;
          .item__count {
            font-size: 20px;
            font-weight: 500;
            padding: 10px;
          }
          .item__type {
            font-size: 13px;
            color: @defaultColor;
          }
        }
      }
    }
    .avator {
      width: 100px;
      border-radius: 100px;
      border: 2px solid white;
      position: absolute;
      bottom: 0.833vw;
      left: 2.5vw;
    }
    .editUserInfo {
      position: absolute;
      bottom: 10px;
      left: calc(2.5vw + 110px);
    }
    .unFollow {
      font-size: 14px;
      position: absolute;
      bottom: 10px;
      left: calc(2.5vw + 110px);
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
  .container__main {
    background-color: rgb(241, 242, 243);
    padding: 10px 265px;
    min-height: calc(100vh - 395px);
    position: relative;
    .el-dropdown-link {
      cursor: pointer;
    }
    .icon-gengduo {
      font-weight: bold;
    }
    .release {
      position: absolute;
      top: 20px;
      right: 40px;
      padding: 12px;
      border-radius: 10px;
      background-color: @activeColor;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>
