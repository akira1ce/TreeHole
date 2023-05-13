<!--
 * @Author: Akira
 * @Date: 2022-12-04 10:12:34
 * @LastEditTime: 2023-05-13 22:12:03
-->
<script setup>
import { computed, onMounted, reactive } from "vue-demi";
import { toSpace } from "../util/handleRouter";
import { local } from "../util";
import { ElMessage } from "element-plus";
import request from "../api/request";
import api from "../api";

const loginUser = local.getItem("user");

const state = reactive({
  userList: [],
  /** 关注/粉丝 */
  mode: history.state.mode || 0,
  pageNo: 1,
  limit: 10,
  infiniteScroll: false,
  isEmpty: false,
});

/** 关注 */
const handleFollow = async (item) => {
  const { fromUserID, toUserID } = item;
  if (state.mode == 0) await request.post(api.follow.addFollow, { fromUserID, toUserID });
  else await request.post(api.follow.addFollow, { fromUserID: toUserID, toUserID: fromUserID });
  /** 更新缓存 */
  item.isFollow = !item.isFollow;
  ElMessage.success("关注成功！");
};

/** 取消关注 */
const handleUnFollow = async (item) => {
  const { fromUserID, toUserID } = item;
  if (state.mode == 0) await request.post(api.follow.removeFollow, { fromUserID, toUserID });
  else await request.post(api.follow.removeFollow, { fromUserID: toUserID, toUserID: fromUserID });
  /** 更新缓存 */
  item.isFollow = !item.isFollow;
  ElMessage.success("取消关注成功！");
};

/** 获取用户列表 */
const getUserList = async () => {
  const { pageNo, limit, mode } = state;
  const followList = await request.post(api.follow.getFollowList, { fromUserID: loginUser._id, pageNo, limit });
  const fansList = await request.post(api.follow.getFansList, { toUserID: loginUser._id, pageNo, limit });
  let data = {};
  if (mode == 0) {
    /** 关注列表 */
    data = followList;
    data.list.forEach((item) => (item.isFollow = true));
  } else {
    /** 粉丝列表 */
    data = fansList;
    const follow_re = followList.list.map((item) => item.toUserID);
    data.list.forEach(async (item) => {
      item.isFollow = follow_re.includes(item.fromUserID);
    });
  }

  if (data.list.length == 0) state.infiniteScroll = true;
  state.userList.push(...data.list);
  state.pageNo++;
};

onMounted(async () => {
  await getUserList();
  if (state.userList.length == 0) state.isEmpty = true;
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getUserList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
    <h1 class="container__title">{{ state.mode == 0 ? "关注列表 👀" : "粉丝列表 😍" }}</h1>
    <el-empty class="center" v-if="state.isEmpty" description="今天也是寂寞的一天~"></el-empty>
    <!-- 关注列表 -->
    <div class="container__list" v-if="state.mode == 0">
      <div class="list__item" v-for="item in state.userList">
        <img class="item__avator" :src="item.toUser.avator" @click="toSpace(item.toUser)" />
        <div class="item__info">
          <span class="info__name">{{ item.toUser.name }}</span>
          <span class="info__follow" @click="handleFollow(item)" v-if="!item.isFollow">关注</span>
          <span class="info__follow" @click="handleUnFollow(item)" v-if="item.isFollow">取消关注</span>
        </div>
      </div>
    </div>
    <!-- 粉丝列表 -->
    <div class="container__list" v-else>
      <div class="list__item" v-for="item in state.userList">
        <img class="item__avator" :src="item.fromUser.avator" @click="toSpace(item.fromUser)" />
        <div class="item__info">
          <span class="info__name">{{ item.fromUser.name }}</span>
          <span class="info__follow" @click="handleFollow(item)" v-if="!item.isFollow">关注</span>
          <span class="info__follow" @click="handleUnFollow(item)" v-if="item.isFollow">取消关注</span>
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
          align-self: center;
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
