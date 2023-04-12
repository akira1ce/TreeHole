<!--
 * @Author: Akira
 * @Date: 2023-02-06 14:40:24
 * @LastEditTime: 2023-04-12 11:09:42
-->
<script setup>
import { onMounted, reactive, toRaw } from "vue-demi";
import TreeCard from "../components/TreeCard.vue";
import { useRoute, useRouter } from "vue-router";
import { defaultState, local } from "../util";
import { ElMessage } from "element-plus";
import request from "../api/request";
import api from "../api";

const router = useRouter();
const route = useRoute();

const state = reactive({
  tree: null,
  treeID: history.state.treeID,
  user: local.getItem("user") || {},
  /** 评论 */
  comments: [],
  comment: { ...defaultState.comment },
  pageNo: 1,
  limit: 10,
  infiniteScroll: false,
  isEmpty: false,
});

/** 发送评论 */
const sendComment = async () => {
  const { comment } = state;
  if (comment.context == "") {
    ElMessage.info("你还没有评论！");
    return;
  }
  const newComment = await request.post(api.comment.addComment, comment);
  newComment.sender = state.user;

  /** 更新缓存 */
  state.comments.unshift(newComment);
  state.comment.context = "";
  ElMessage.success("发表成功");
};

/** 删除评论 */
const removeComment = async (comment, index) => {
  await request.post(api.comment.removeById, { _id: comment._id });
  state.comments.splice(index, 1);
  ElMessage.success("删除成功");
};

/** 获取评论列表 */
const getCommentList = async () => {
  const { pageNo, limit, treeID } = state;

  const comments = await request.post(api.comment.getCommentByTreeID, { treeID, pageNo, limit });

  if (comments.length < state.limit) state.infiniteScroll = true;
  state.comments.push(...comments);
  state.pageNo++;
};

/**
 * 跳转个人空间
 * @param {proxy} user
 */
const toSpace = (user) => {
  if (history.state.spaceUser?._id == user._id) return;
  else if (route.name != "Space") router.push({ name: "Space", state: { spaceUser: toRaw(user) } });
  else {
    history.state.spaceUser = toRaw(user);
    router.go(0);
  }
};

onMounted(async () => {
  const userID = state.user._id;
  const treeID = state.treeID;

  state.comment.treeID = treeID;
  state.comment.senderID = userID;

  state.tree = await request.post(api.tree.getTreeById, { _id: treeID });
  if (!state.tree) {
    state.isEmpty = true;
    return;
  }
  getCommentList();
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getCommentList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
    <div class="container__content" v-if="state.tree != null">
      <!-- 苗木 -->
      <TreeCard :key="state.tree._id" :tree="state.tree"></TreeCard>
      <!-- 评论 -->
      <el-card shadow="hover" class="content__comments">
        <!-- 评论框 -->
        <div class="comments__input">
          <img :src="state.user.avator" class="avator" />
          <el-input v-model="state.comment.context" placeholder="发表你的评论吧~" @keydown.enter="sendComment"></el-input>
        </div>
        <!-- 暂无评论 -->
        <span v-show="state.comments.length == 0">暂无评论哦~</span>
        <!-- 评论列表 -->
        <div class="comments__item" v-for="(item, index) in state.comments">
          <img :src="item.sender.avator" class="avator" @click="toSpace(item.sender)" />
          <div class="item__main">
            <div class="main__senderInfo">
              <span class="senderInfo__name">{{ item.sender.name }}</span>
              <span class="senderInfo__time"> · {{ item.time.split(" ")[0] }}</span>
            </div>
            <div class="main__context">{{ item.context }}</div>
          </div>
          <!-- 删除评论 -->
          <i class="iconfont icon-lajitong" v-show="item.senderID == state.user._id" @click="removeComment(item, index)"></i>
        </div>
      </el-card>
    </div>
    <el-empty class="center" description="该苗木已经不在了~" v-if="state.isEmpty"></el-empty>
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(241, 242, 243);
@deepDefaultColor: rgb(165, 165, 165);
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
  justify-content: center;
  height: calc(100vh - 76px);
  overflow-y: overlay;
  position: relative;
  background-color: @defaultColor;
  .container__content {
    .flex__column();
    align-items: center;
    width: 55%;
    height: fit-content;
    padding: 5px 0;
    gap: 5px;
    .content__comments {
      width: 600px;
      flex: 1;
      :deep(.el-card__body) {
        .flex__column();
        gap: 10px;
      }
      .comments__input {
        .flex__row();
        gap: 10px;
        padding: 20px 0;
      }
      .avator {
        width: 36px;
        height: 100%;
        border-radius: 36px;
        cursor: pointer;
      }
      .comments__item {
        &:hover {
          .iconfont {
            opacity: 1;
          }
        }
        .flex__row();
        gap: 10px;
        .item__main {
          .flex__column();
          flex: 1;
          gap: 10px;
          .main__senderInfo {
            color: @deepDefaultColor;
            .senderInfo__name {
              font-weight: bold;
              font-size: 14px;
            }
            .senderInfo__time {
              font-size: 12px;
              font-weight: lighter;
            }
          }
          .main__context {
            font-size: 16px;
          }
        }
        .iconfont {
          cursor: pointer;
          opacity: 0;
          transition: all 0.3s;
          font-size: 20px;
          align-self: center;
          &:hover {
            color: red;
          }
        }
      }
    }
  }
}
</style>
