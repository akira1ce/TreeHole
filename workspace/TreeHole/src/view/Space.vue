<script setup>
import api from "../api";
import request from "../api/request";
import TreeCard from "../components/TreeCard.vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import { computed, onMounted, reactive } from "vue-demi";

// [state]
const user = history.state.user || JSON.parse(localStorage.getItem("user"));
const state = reactive({
  record: {
    _id: "",
    userID: "",
    current: 0,
    following: [],
    fans: [],
    collect: [],
    treeList: [],
    browsingHistory: [],
    order: [],
  },
});

// [methods]
const handleCommand = (command) => {
  console.log(`output->command`, command);
};

// [computed]
const record = computed(() => state.record);

onMounted(async () => {
  let params = { userID: user._id };
  state.record = await request.post(api.record.getRecordByUserID, params);
});
</script>

<template>
  <div class="container scroll">
    <div class="container__top">
      <div class="top__cover"></div>
      <div class="top__user">
        <span class="user__name">{{ user.name }}</span>
        <div class="user__record">
          <div class="record__item">
            <span class="item__count">{{ record.following?.length || "-" }}</span>
            <span class="item__type">关注</span>
          </div>
          <div class="record__item">
            <span class="item__count">{{ record.fans?.length || "-" }}</span>
            <span class="item__type">粉丝</span>
          </div>
        </div>
      </div>
      <img class="avator" :src="user.avator" />
      <el-button class="editUserInfo">编辑个人资料</el-button>
    </div>
    <div class="container__main">
      <div class="release">发布🙌</div>
      <el-empty description="description" v-show="state.record.treeList.length == 0" />
      <TreeCard v-for="(item, index) in state.record.treeList" :tree="item" :user="user">
        <el-dropdown trigger="click" @command="handleCommand">
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
