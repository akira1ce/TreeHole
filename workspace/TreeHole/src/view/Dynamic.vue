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
  const treeList = await request.post(api.tree.getTreeListByUserID, {
    userID: state.following[index]?._id,
  });
  state.followTrees = treeList;
};

const switchFollow = async () => {
  const index = state.current;
  const isFollow = state.following[index].isFollow;
  state.following[index].isFollow = !isFollow;
  const params = {
    userID: state.user._id,
    mode: 0,
    id: state.following[index]._id,
  };
  const res = await request.post(api.record.modifyRecord, params);
};

// [computed]
const currentUser = computed(() => {
  return state.following[state.current];
});

onMounted(async () => {
  const userID = state.user._id;
  // getRecordByUserID
  const record = await request.post(api.record.getRecordByUserID, { userID });
  state.following = record.following;
  state.following.forEach((item) => (item.isFollow = true));
  // getTreeList
  getTreeList(0);
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
    <div class="container__content scroll">
      <div class="content__treeList">
        <el-card
          class="treeCard"
          shadow="hover"
          :key="item._id"
          v-for="(item, index) in state.followTrees"
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
              <div class="unFollow" @click="switchFollow">
                {{ currentUser.isFollow ? "取消关注" : "关注" }}
              </div>
            </div>
          </div>
          <div class="treeCard__main">
            <div class="main__describe">
              {{ item.describe }}
            </div>
            <div class="main__imgList">
              <photo-provider>
                <photo-consumer
                  v-for="src in item.imgs"
                  :intro="src"
                  :key="src"
                  :src="src"
                >
                  <img :src="src" class="view-box" />
                </photo-consumer>
              </photo-provider>
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
  height: calc(100vh - 76px);
  overflow: hidden;
  position: relative;
  background-color: @defaultColor;
  font-family: @defaultFont;
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
      .treeCard {
        border-radius: 5px;
        margin: 5px 0;
        .treeCard__header {
          .flex__row();
          justify-content: space-between;
          align-items: center;
          .header__left {
            .flex__row();
            .header__avator {
              width: 36px;
              margin-right: 12px;
              border-radius: 36px;
              cursor: pointer;
            }
            .header__info {
              .flex__column();
              .info__name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                color: @activeColor;
                cursor: pointer;
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
        .treeCard__main {
          .flex__column();
          .main__describe {
            padding: 15px 0;
            font-size: 16px;
            user-select: text;
          }
          .main__imgList {
            .view-box {
              padding: 2px;
              width: 180px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
