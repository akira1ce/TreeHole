<script setup>
import { computed, onMounted, reactive, ref, toRaw } from "vue-demi";
import { useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { local, defaultState } from "../util";

const user = local.getItem("user");
const router = useRouter();

// [state]
const state = reactive({
  record: defaultState,
});
const activeName = ref("1");

// [computed]
const record = computed(() => {
  return state.record;
});

// [methods]
/**
 * 跳转个人中心
 * @param {object} spaceUser 
 */
const toSpace = (spaceUser) => {
  spaceUser = toRaw(spaceUser);
  router.push({ name: "Space", state: { spaceUser } });
};
// 取消关注
const cancelFollow = async (item) => {
  const params = {
    userID1: user._id,
    userID2: item._id,
  };
  // update follow status
  item.isFollow = !item.isFollow;
  await request.post(api.record.modifyRecordUser, params);
};

onMounted(async () => {
  const params = { userID: user._id };
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
    <el-collapse v-model="activeName" accordion>
      <!-- 关注列表 -->
      <el-collapse-item title="关注列表 👀" name="1">
        <div class="list">
          <div class="list__item" v-for="(item, index) in record.followList" :key="item._id">
            <img class="item__avator" :src="item.avator" @click="toSpace(item)" />
            <div class="item__info">
              <span class="info__name">{{ item.name }}</span>
              <span class="info__follow" @click="cancelFollow(item)">{{ item.isFollow ? "取消关注" : "关注" }}</span>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <!-- 粉丝列表 -->
      <el-collapse-item title="粉丝列表 😍" name="2">
        <div class="list">
          <div class="list__item" v-for="(item, index) in record.fansList" :key="item._id">
            <img class="item__avator" :src="item.avator" @click="toSpace(item)" />
            <div class="item__info">
              <span class="info__name">{{ item.name }}</span>
              <span class="info__follow" @click="cancelFollow(item)">{{ item.isFollow ? "取消关注" : "关注" }}</span>
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
    &:deep .el-collapse-item__header {
      border: none;
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
