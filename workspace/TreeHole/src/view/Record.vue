<!--
 * @Author: Akira
 * @Date: 2022-12-04 10:12:34
 * @LastEditTime: 2023-03-03 17:42:25
-->
<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, toRaw } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { local, defaultState } from "../util";

const router = useRouter();
const route = useRoute();

const loginUser = local.getItem("user");

const state = reactive({
  record: defaultState.record,
  userList: [],
  /** 关注/粉丝 */
  mode: history.state.mode || 0,
  pageNo: 1,
  limit: 10,
  infiniteScroll: false,
});

/**
 * 跳转个人空间
 * @param {Object} user
 */
const toSpace = (user) => {
  if (history.state.spaceUser?._id == user._id) return;
  else if (route.name != "Space") router.push({ name: "Space", state: { spaceUser: toRaw(user) } });
  else {
    history.state.spaceUser = toRaw(user);
    router.go(0);
  }
};

/** 关注/取消关注 */
const followHandle = async (item) => {
  const userID1 = loginUser._id;
  const userID2 = item._id;
  await request.post(api.record.modifyRecordUser, { userID1, userID2 });

  item.isFollow = !item.isFollow;

  if (item.isFollow) ElMessage.success("关注成功");
  else ElMessage.success("取消关注成功");
};

/** 获取用户列表 */
const getUserList = async () => {
  const { pageNo, limit, record, mode } = state;
  let data = {};
  if (mode == 0) {
    /** 关注列表 */
    data = await request.post(api.user.getUserListByID, { users: record.following, pageNo, limit });
    data.list.forEach((item) => (item.isFollow = true));
  } else {
    /** 粉丝列表 */
    data = await request.post(api.user.getUserListByID, { users: record.fans, pageNo, limit });
    data.list.forEach((item) => {
      if (record.following.indexOf(item._id) != -1) item.isFollow = true;
      else item.isFollow = false;
    });
  }

  if (data.list.length < state.limit) state.infiniteScroll = true;
  state.userList.push(...data.list);
  state.pageNo++;
};

onMounted(async () => {
  try {
    state.record = await request.post(api.record.getRecordByUserID, { userID: loginUser._id });
    await getUserList();
  } catch (error) {
    ElMessage.error(error.message);
  }
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getUserList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
    <h1 class="container__title">{{ state.mode == 0 ? "关注列表 👀" : "粉丝列表 😍" }}</h1>
    <!-- 关注列表 -->
    <div class="container__list" v-if="state.mode == 0">
      <div class="list__item" v-for="(item, index) in state.userList">
        <img class="item__avator" :src="item.avator" @click="toSpace(item)" />
        <div class="item__info">
          <span class="info__name">{{ item.name }}</span>
          <span class="info__follow" @click="followHandle(item)">{{ item.isFollow ? "取消关注" : "关注" }}</span>
        </div>
      </div>
    </div>
    <!-- 粉丝列表 -->
    <div class="container__list" v-else>
      <div class="list__item" v-for="(item, index) in state.userList">
        <img class="item__avator" :src="item.avator" @click="toSpace(item)" />
        <div class="item__info">
          <span class="info__name">{{ item.name }}</span>
          <span class="info__follow" @click="followHandle(item)">{{ item.isFollow ? "取消关注" : "关注" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// calc sidebar topbar
@sidebar_width: 65px;
@topbar_height: 75px;

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
  height: calc(100vh - @topbar_height);
  overflow-y: overlay;
  padding: 20px 3.333vw;
  .container__title {
    font-size: 18px;
    padding: 10px 0;
  }
  .container__list {
    .flex__row();
    flex-wrap: wrap;
    position: relative;
    .list__item {
      .flex__row();
      padding: 10px 0;
      width: 50%;
      .item__avator {
        width: 80px;
        border-radius: 80px;
        margin-right: 20px;
        cursor: pointer;
      }
      .item__info {
        .flex__column();
        justify-content: space-around;
        .info__name {
          font-size: 18px;
        }
        .info__follow {
          font-size: 14px;
          padding: 10px;
          color: @activeColor;
          background-color: rgba(94, 161, 97, 0.11);
          border-radius: 10px;
          transition: all 0.3s;
          cursor: pointer;
          &:hover {
            color: white;
            background-color: @activeColor;
          }
        }
      }
    }
  }
}
</style>
