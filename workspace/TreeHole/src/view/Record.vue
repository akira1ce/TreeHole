<script setup>
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, ref, toRaw } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { local, defaultState } from "../util";

const router = useRouter();
const route = useRoute();

const loginUser = local.getItem("user");

// [state]
const state = reactive({
  record: defaultState,
});
const activeName = ref("1");

// [methods]
/**
 * 跳转个人中心
 * @param {object} spaceUser
 */
const toSpace = async (spaceUser, treeID) => {
  if (spaceUser == undefined) {
    if (route.name == "Space") {
      history.state.spaceUser = null;
      router.go(0);
      return;
    }
    router.push({ name: "Space" });
    return;
  }
  spaceUser = toRaw(spaceUser);
  if (treeID) {
    const userID = local.getItem("user")._id;
    await request.post(api.record.modifyRecordTree, { userID, treeID, mode: 0, clearAll: 0 });
    router.push({ name: "Space", state: { spaceUser, treeID } });
  } else router.push({ name: "Space", state: { spaceUser } });
};

// 关注/取消关注
const followHandle = async (item) => {
  const userID1 = loginUser._id;
  const userID2 = item._id;
  await request.post(api.record.modifyRecordUser, { userID1, userID2 });
  // 更新缓存
  const { fans, fansList, following, followList } = state.record;
  const isFollow = item.isFollow;

  const index_follow = following.indexOf(userID2);
  const index_fans = fans.indexOf(userID2);
  if (index_follow != -1) followList[index_follow].isFollow = !isFollow;
  if (index_fans != -1) fansList[index_fans].isFollow = !isFollow;

  if (!isFollow) ElMessage.success("关注成功");
  else ElMessage.success("取消关注成功");
};

onMounted(async () => {
  const params = { userID: loginUser._id };
  state.record = await request.post(api.record.getRecordByUserID, params);
  const { followList, fansList, following } = state.record;
  followList.forEach((item) => (item.isFollow = true));
  fansList.forEach((item) => {
    if (following.indexOf(item._id) != -1) item.isFollow = true;
    else item.isFollow = false;
  });
});
</script>

<template>
  <div class="container">
    <el-collapse v-model="activeName">
      <!-- 关注列表 -->
      <el-collapse-item title="关注列表 👀" name="1">
        <div class="list">
          <div class="list__item" v-for="(item, index) in state.record.followList">
            <img class="item__avator" :src="item.avator" @click="toSpace(item)" />
            <div class="item__info">
              <span class="info__name">{{ item.name }}</span>
              <span class="info__follow" @click="followHandle(item)">{{ item.isFollow ? "取消关注" : "关注" }}</span>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <!-- 粉丝列表 -->
      <el-collapse-item title="粉丝列表 😍" name="2">
        <div class="list">
          <div class="list__item" v-for="(item, index) in state.record.fansList">
            <img class="item__avator" :src="item.avator" @click="toSpace(item)" />
            <div class="item__info">
              <span class="info__name">{{ item.name }}</span>
              <span class="info__follow" @click="followHandle(item)">{{ item.isFollow ? "取消关注" : "关注" }}</span>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
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
  overflow: hidden;
  padding: 30px 3.333vw;
  .el-collapse {
    border: none;
    .el-collapse-item {
      border: none;
    }
    :deep(.el-collapse-item__header) {
      border: none;
      border-radius: 10px;
      font-size: 16px;
    }
  }
  .list {
    .flex__row();
    position: relative;
    .list__item {
      .flex__row();
      align-items: center;
      width: 50%;
      .item__avator {
        width: 80px;
        border-radius: 80px;
        margin-right: 20px;
        cursor: pointer;
      }
      .item__info {
        .flex__column();
        .info__name {
          font-size: 16px;
        }
        .info__follow {
          font-size: 14px;
          padding: 5px 10px;
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
}
</style>
