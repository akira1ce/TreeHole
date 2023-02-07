<script setup>
import { onMounted, reactive } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import request from "../api/request";
import { defaultState, local, recordHandle } from "../util";
import TreeCard from "../components/TreeCard.vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();

// [state]
const state = reactive({
  tree: { ...history.state.tree } || {},
  user: local.getItem("user") || {},
  record: { ...defaultState.record },
  comments: [],
  comment: { ...defaultState.comment },
  pageNo: 1,
  limit: 10,
  infiniteScroll: false,
});

// [methods]
/**
 * 收藏树
 * @param {string} treeID
 */
const collectHandle = (tree) => {
  recordHandle.collect(state.record, state.user, tree);
};

/**
 * 发送评论
 */
const sendComment = async () => {
  const { comment } = state;
  if (comment.context == "") {
    ElMessage.info("你还没有评论！");
    return;
  }
  const newComment = await request.post(api.comment.addComment, comment);
  newComment.sender = state.user;

  // 更新缓存
  state.comments.unshift(newComment);
  state.comment.context = "";
  ElMessage.success("发布成功");
};

/**
 * 删除评论
 */
const removeComment = async (comment, index) => {
  await request.post(api.comment.removeById, { _id: comment._id });
  state.comments.splice(index, 1);
  ElMessage.success("删除成功");
};

const getCommentList = async () => {
  const { pageNo, limit, tree } = state;
  const treeID = tree._id;

  const comments = await request.post(api.comment.getCommentByTreeID, { treeID, pageNo, limit });

  if (comments.length < state.limit) state.infiniteScroll = true;
  state.comments.push(...comments);
  state.pageNo++;
};

onMounted(async () => {
  const userID = state.user._id;
  const treeID = state.tree._id;
  const { pageNo, limit } = state;

  state.comment.treeID = treeID;
  state.comment.senderID = userID;

  state.record = await request.post(api.record.getRecordByUserID, { userID });
  getCommentList();
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getCommentList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
    <div class="container__content">
      <!-- 苗木 -->
      <TreeCard :key="state.tree._id" :tree="state.tree" :collectHandle="collectHandle" :record="state.record"></TreeCard>
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
          <img :src="item.sender.avator" class="avator" />
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
  overflow-y: auto;
  position: relative;
  background-color: @defaultColor;
  .container__content {
    .flex__column();
    padding-bottom: 5px;
    width: 60%;
    height: fit-content;
    .content__comments {
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
        }
      }
    }
  }
}
</style>
