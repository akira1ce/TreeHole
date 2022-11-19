<script setup>
import api from "../api";
import request from "../api/request";
import { computed, onMounted, reactive, ref } from "vue-demi";

// [state]
const state = reactive({
  current: 0,
  following: [],
  followTrees: [],
  user: JSON.parse(localStorage.getItem("user")),
});

// [methods]
const errorHandler = () => true;

const selectUser = (e) => {
  const id = e.target.dataset?.id || e.target.parentNode.dataset?.id;
  if (state.current == id || id == undefined) return;
  state.current = id;
  getTreeList(state.current);
};

const getTreeList = async (index) => {
  const treeList = await request.post(api.tree.getTreeListByOwnerID, {
    ownerID: state.following[index]?._id,
  });
  state.followTrees = treeList;
};

// [computed]
const currentUser = computed(() => {
  return state.following[state.current];
});

onMounted(async () => {
  try {
    const userID = state.user._id;
    // getRecordByUserID
    const record = await request.post(api.record.getRecordByUserID, { userID });
    // getUserList
    const userList = await request.get(api.user.getUserList);
    userList.forEach((item) => {
      if (record.following.indexOf(item._id) != -1) {
        const { _id, name, avator } = item;
        state.following.push({ _id, name, avator });
      }
    });
    // getTreeList
    getTreeList(0);
  } catch (e) {
    console.log(`output->e`, e);
  }
});
</script>

<template>
  <div class="container">
    <div class="container__follow" @click="selectUser">
      <div
        class="follow__item"
        :id="state.current == index && 'active'"
        :data-id="index"
        :key="item._id"
        v-for="(item, index) in state.following"
      >
        <img :src="item.avator" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="container__content">
      <div class="content__treeList">
        <el-card
          class="treeCard"
          shadow="hover"
          :key="item._id"
          v-for="item in state.followTrees"
        >
          <div class="treeCard__header">
            <div class="header__left">
              <img class="header__avator" :src="currentUser.avator" />
              <div class="header__info">
                <span class="info__name">{{ currentUser.name }}</span>
                <span class="info__time">{{
                  item.time.split(" ")[0].substring(5).split("/").join("-")
                }}</span>
              </div>
            </div>
            <div class="header__right">
              <div class="unFollow">取消关注</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
//font
@defaultFont: PingFang SC, Microsoft YaHei;

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
  height: calc(100vh - 6.3vw);
  overflow: hidden;
  position: relative;
  background-color: @defaultColor;
  font-family: @defaultFont;
  .container__follow {
    .flex__column();
    width: 19.167vw;
    height: 100%;
    padding: 2.083vw 1.25vw;
    background-color: white;
    .follow__item {
      .flex__row();
      align-items: center;
      padding: 0.833vw 1.25vw;
      border-radius: 1vw;
      overflow: hidden;
      transition: all 0.5s;
      img {
        width: 3vw;
        border-radius: 3vw;
        margin-right: 1vw;
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
    height: 100%;
    flex: 1;
    .content__treeList {
      .flex__column();
      width: 68%;
      height: 100%;
      .treeCard {
        border-radius: 5px;
        .treeCard__header {
          .flex__row();
          justify-content: space-between;
          align-items: center;
          .header__left {
            .flex__row();
            .header__avator {
              width: 3vw;
              margin-right: 1vw;
              border-radius: 3vw;
            }
            .header__info {
              .flex__column();
              .info__name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                color: @activeColor;
              }
              .info__time {
                color: rgb(150, 152, 153);
                font-size: 12px;
              }
            }
          }
          .header__right {
            .unFollow {
              font-size: 14px;
              padding: 10px;
              color: @activeColor;
              background-color: rgba(94, 161, 97, 0.11);
              border-radius: 8px;
              transition: all .3s;
              &:hover {
                color: white;
                background-color: @activeColor;
              }
            }
          }
        }
      }
    }
  }
}
</style>
