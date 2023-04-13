<!--
 * @Author: Akira
 * @Date: 2023-02-07 23:43:35
 * @LastEditTime: 2023-04-13 15:16:15
-->
<script setup>
import useClipboard from "vue-clipboard3";
import { defineProps, reactive, toRaw, watchEffect, onMounted, watch } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request from "../api/request";
import { local } from "../util";
import api from "../api";

const router = useRouter();
const route = useRoute();

const { toClipboard } = useClipboard();

const props = defineProps(["tree"]);

const { tree } = props;
const owner = tree.owner;
const loginUser = local.getItem("user");

const state = reactive({
  isCollect: false,
  isFollow: false,
});

/** 收藏 */
const handleCollect = async (userID, treeID) => {
  await request.post(api.collect.addCollect, { userID, treeID });
  state.isCollect = !state.isCollect;
  ElMessage.success("收藏成功！");
};

/** 取消收藏 */
const handleUnCollect = async (userID, treeID) => {
  await request.post(api.collect.removeCollect, { userID, treeID });
  state.isCollect = !state.isCollect;
  ElMessage.success("取消收藏成功！");
};

/**
 * 跳转聊天
 * - user1
 * - user2
 * - tree
 * @param {string} userID1
 * @param {string} userID2
 * @param {string} treeID
 */
const toSocket = async (userID1, userID2, tree) => {
  const treeID = tree._id;
  /** 新增会话 */
  await request.post(api.socket.addSocket, { userID1, userID2, treeID, tree });
  router.push({ name: "Socket", state: { userID: userID2, treeID } });
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

/**
 * 跳转苗木详情
 * @param {string} treeID
 */
const toTreeDetail = async (treeID) => {
  if (route.name == "TreeDetail") return;
  /** 浏览记录 */
  await request.post(api.history.addHistory, { userID: loginUser._id, treeID });
  router.push({ name: "TreeDetail", state: { treeID } });
};

/**
 * 复制地址
 * @param {string} location
 */
const copyLocation = async (location) => {
  try {
    await toClipboard(location);
    router.push({ path: "/map", query: { location } });
    ElMessage.success("复制成功");
  } catch (e) {
    ElMessage.error(e);
  }
};

onMounted(async () => {
  state.isCollect = await request.post(api.collect.isCollect, { userID: loginUser._id, treeID: tree._id });
  if (loginUser._id != owner._id) state.isFollow = await request.post(api.follow.isFollow, { fromUserID: loginUser._id, toUserID: owner._id });
});
</script>

<template>
  <!-- 个人空间、动态 树卡片 -->
  <el-card class="treeCard" shadow="hover">
    <!-- 树-头部 -->
    <div class="treeCard__header">
      <!-- 树-头左 -->
      <div class="header__left">
        <!-- 用户信息 -->
        <img class="header__avator" :src="owner.avator" @click="toSpace(owner)" />
        <div class="header__info">
          <span class="info__name">{{ owner.name }}</span>
          <span class="info__time">{{ tree.time.split(",")[0] }}</span>
        </div>
      </div>
      <!-- 树-头右 -->
      <div class="header__right">
        <!-- 插槽-option -->
        <slot></slot>
      </div>
    </div>
    <!-- 卡片-主体 -->
    <div class="treeCard__main">
      <!-- 树-标题 -->
      <div class="main__title">
        <span>{{ tree.title }}</span>
        <el-tag type="danger" class="title__price">￥{{ tree.price }}</el-tag>
      </div>
      <!-- 树-描述 -->
      <div class="main__describe">{{ tree.describe }}</div>
      <!-- 树-地址 -->
      <div class="main__location" @click="copyLocation(tree.location)"><i class="iconfont icon-dingweidian--"></i>{{ tree.location }}</div>
      <!-- 树-信息 -->
      <div class="main__Info">
        <div class="info__item">
          <div class="item__key">树种</div>
          <div class="item__value">{{ tree.type }}</div>
        </div>
        <span class="item-split"></span>
        <div class="info__item">
          <div class="item__key">高度</div>
          <div class="item__value">{{ tree.height }}</div>
        </div>
        <span class="item-split"></span>
        <div class="info__item">
          <div class="item__key">冠径</div>
          <div class="item__value">{{ tree.crownDiameter }}</div>
        </div>
        <span class="item-split"></span>
        <div class="info__item">
          <div class="item__key">直径</div>
          <div class="item__value">{{ tree.diameter }}</div>
        </div>
        <span class="item-split"></span>
        <div class="info__item">
          <div class="item__key">分支点</div>
          <div class="item__value">{{ tree.branchPoint }}</div>
        </div>
      </div>
      <!-- 树-图片 -->
      <div class="main__imgList">
        <photo-provider>
          <photo-consumer v-for="src in tree.imgs" :intro="src.url" :key="src.url" :src="src.url">
            <img :src="src.url" class="view-box" />
          </photo-consumer>
        </photo-provider>
      </div>
      <!-- 卡片-底部 -->
      <div class="main__footer" v-if="owner._id != loginUser._id">
        <!-- 收藏 -->
        <i class="iconfont icon-shoucang-active" v-show="state.isCollect" @click="handleUnCollect(loginUser._id, tree._id)"></i>
        <i class="iconfont icon-shoucang" v-show="!state.isCollect" @click="handleCollect(loginUser._id, tree._id)"></i>
        <!-- 联系卖家 -->
        <el-button round @click="toSocket(loginUser._id, owner._id, tree)" v-if="tree.status == 0">联系卖家</el-button>
        <el-button round type="info" disabled v-if="tree.status > 0">已售</el-button>
      </div>
      <span class="sold" style="background-color: rgba(246, 171, 113, 0.8)" v-else-if="tree.status == '-1'">待审核</span>
      <span class="sold" v-else-if="tree.status > 0">已售</span>
      <i class="iconfont icon-youjiantou1" v-if="route.name != 'TreeDetail'" @click="toTreeDetail(tree._id)"></i>
    </div>
  </el-card>
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

.treeCard {
  border-radius: 5px;
  position: relative;
  width: 600px;
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
    padding: 10px 0;
    gap: 12px;
    .main__title {
      .flex__row();
      gap: 10px;
      align-items: center;
      font-size: 16px;
      .title__price {
        font-size: 12px;
        font-weight: bold;
        color: rgb(255, 105, 36);
      }
    }
    .main__describe {
      font-size: 16px;
      user-select: text;
    }
    .main__location {
      cursor: pointer;
      .icon-dingweidian-- {
        color: rgb(65, 182, 146);
      }
    }
    .main__Info {
      .flex__row();
      align-items: center;
      .info__item {
        .flex__column();
        height: 40px;
        justify-content: space-between;
        font-size: 15px;
        cursor: pointer;
        .item__key {
          color: rgb(167, 167, 167);
        }
      }
      .item-split {
        width: 1px;
        height: 30px;
        margin: 0 20px;
        background-color: rgb(245, 245, 245);
      }
    }
    .main__imgList {
      .view-box {
        padding: 2px;
        width: 180px;
        object-fit: cover;
        aspect-ratio: 1.74;
        cursor: pointer;
      }
    }
    .main__footer {
      .flex__row();
      align-items: center;
      justify-content: space-between;
      .iconfont {
        cursor: pointer;
        font-size: 20px;
      }
      .icon-shoucang-active {
        color: #efb336;
      }
    }
    .icon-youjiantou1 {
      position: absolute;
      top: 45%;
      right: -50px;
      font-size: 50px;
      color: rgba(94, 161, 97, 0.6);
      transition: all 0.5s;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
    }
    .sold {
      position: absolute;
      color: white;
      background-color: rgba(94, 161, 97);
      text-align: center;
      line-height: 30px;
      width: 80px;
      height: 80px;
      bottom: -40px;
      right: -40px;
      font-size: 14px;
      border-radius: 5px;
      transform: rotateZ(-45deg);
    }
  }
  &:hover {
    .icon-youjiantou1 {
      right: 25px;
    }
  }
}
</style>
