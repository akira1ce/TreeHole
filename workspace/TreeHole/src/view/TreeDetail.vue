<script setup>
import { computed, onMounted, reactive, toRaw } from "vue-demi";
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
  tree: null,
  treeID: history.state.treeID,
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
 * 关注用户
 * @param {string} userID1
 * @param {string} userID2
 */
const followHandle = async (userID1, userID2) => {
  const { record, user, tree } = state;
  recordHandle.follow(record, user._id, tree.ownerID);
};

/**
 * 收藏树
 * @param {string} treeID
 */
const collectHandle = (tree) => {
  recordHandle.collect(state.record, state.user._id, tree._id);
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

// 获取评论列表
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

// [computed]
// 是否关注
const isFollow = computed(() => {
  const { record, tree } = state;
  return record.following.indexOf(tree.ownerID) != -1;
});

onMounted(async () => {
  const userID = state.user._id;
  const treeID = state.treeID;

  state.comment.treeID = treeID;
  state.comment.senderID = userID;

  state.record = await request.post(api.record.getRecordByUserID, { userID });
  state.tree = await request.post(api.tree.getTreeById, { _id: treeID });
  if (state.tree) getCommentList();
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getCommentList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
    <div class="container__content">
      <!-- 苗木 -->
      <TreeCard v-if="state.tree != null" :key="state.tree._id" :tree="state.tree" :collectHandle="collectHandle" :record="state.record">
        <div class="unFollow" @click="followHandle">
          {{ isFollow ? "取消关注" : "关注" }}
        </div>
      </TreeCard>
      <!-- 评论 -->
      <el-card shadow="hover" class="content__comments" v-if="state.tree != null">
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
    padding: 10px 260px;
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
</style>
