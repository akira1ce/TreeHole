<script setup>
import api from "../api";
import request from "../api/request";
import { computed, nextTick, onMounted, reactive, ref } from "vue-demi";
import { local, defaultState, recordHandle } from "../util";
import TreeCard from "../components/TreeCard.vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

// [state]
const loginUser = local.getItem("user");
const user = history.state.spaceUser || loginUser;
const treeID = history.state.treeID || "";
const state = reactive({
  record: defaultState.record,
  loginRecord: defaultState.record,
  isFollow: false,
});

// [methods]
/**
 * 收藏
 * @param {string} treeID
 */
const collectHandle = (tree) => {
  recordHandle.collect(state.record, loginUser, tree);
};

// 跳转记录
const toRecord = () => {
  if (isCurrentUser.value) router.push({ name: "Record" });
};

// 跳转聊天
const toSocket = async () => {
  const userID1 = loginUser._id;
  const userID2 = user._id;
  const treeID = "";
  await request.post(api.socket.addSocket, { userID1, userID2, treeID });
  router.push({ name: "Socket", state: { userID: userID2 } });
};

const handleCommand = (command) => {
  console.log(`output->command`, command);
};

// 关注/取消关注
const followHandle = async () => {
  const { fans, fansList } = state.record;

  const userID1 = loginUser._id;
  const userID2 = user._id;
  await request.post(api.record.modifyRecordUser, { userID1, userID2 });
  
  // 更新缓存
  state.isFollow = !state.isFollow;
  const index = fans.indexOf(loginUser._id);
  if (index == -1) {
    fans.push(loginUser._id);
    fansList.push(loginUser);
    ElMessage.success("关注成功");
  } else {
    fans.splice(index, 1);
    fansList.splice(index, 1);
    ElMessage.success("取消关注成功");
  }
};

// [computed]
const record = computed(() => state.record);

// 是否是当前用户
const isCurrentUser = computed(() => {
  return user._id == loginUser._id;
});

onMounted(async () => {
  state.loginRecord = await request.post(api.record.getRecordByUserID, { userID: loginUser._id });
  state.record = await request.post(api.record.getRecordByUserID, { userID: user._id });
  if (!isCurrentUser.value) state.isFollow = state.record.fans.indexOf(loginUser._id) != -1;

  // 滚动条行为
  if (treeID != "") {
    nextTick(() => {
      const mainRef = document.getElementsByClassName("el-card");
      let targetTree = 0;
      state.record.treeList.forEach((item, index) => {
        if (item._id == treeID) targetTree = index;
      });
      mainRef[targetTree].scrollIntoView({ block: "center" });
    });
  }
});
</script>

<template>
  <div class="container scroll">
    <!-- 个人空间-顶部 -->
    <div class="container__top">
      <!-- 封面 -->
      <div class="top__cover"></div>
      <!-- 用户信息 -->
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
      <div class="btnOption">
        <el-button class="editUserInfo" v-if="isCurrentUser">编辑个人资料</el-button>
        <div class="unFollow btn" @click="followHandle" v-if="!isCurrentUser">{{ state.isFollow ? "取消关注" : "关注" }}</div>
        <div class="message btn" @click="toSocket" v-if="!isCurrentUser">发信息</div>
      </div>
    </div>
    <!-- 主体-树列表 -->
    <div class="container__main">
      <div class="release" v-if="isCurrentUser">发布🙌</div>
      <el-empty description="description" v-if="record.treeList.length == 0" />
      <TreeCard v-for="(item, index) in record.treeList" :key="item._id" :tree="item" :record="state.loginRecord" :collectHandle="collectHandle">
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

.btn {
  font-size: 14px;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
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
    .btnOption {
      position: absolute;
      left: calc(2.5vw + 110px);
      bottom: 10px;
      gap: 10px;
      .flex__row();
      .editUserInfo {
        bottom: 10px;
      }
      .unFollow {
        color: @activeColor;
        background-color: rgba(94, 161, 97, 0.11);
        &:hover {
          color: white;
          background-color: @activeColor;
        }
      }
      .message {
        color: black;
        background-color: rgba(164, 179, 165, 0.144);
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

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>
