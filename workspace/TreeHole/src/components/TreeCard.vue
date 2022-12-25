<script setup>
import useClipboard from "vue-clipboard3";
import { defineProps, onMounted, reactive, toRaw } from "vue-demi";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Position } from "@element-plus/icons-vue";
import { local } from "../util";
import request from "../api/request";
import api from "../api";

const router = useRouter();
const { toClipboard } = useClipboard();
const props = defineProps(["tree", "collectHaddle", "record"]);

// [state]
const { tree, collectHaddle, record } = props;
const user = tree.owner;
const loginUser = local.getItem("user");
const state = reactive({
  isCollect: false,
});

// [methods]
const haddleCollect = async () => {
  state.isCollect = !state.isCollect;
  await collectHaddle(tree._id);
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
const toSocket = async (userID1, userID2, treeID) => {
  await request.post(api.socket.addSocket, { userID1, userID2, treeID });
  router.push({ name: "Socket", state: { userID: userID2, treeID } });
};

/**
 * 跳转个人空间
 * - 若 treeID 存在，滚动条跳转至对应位置
 * @param {object} spaceUser
 * @param {string} treeID
 */
const toSpace = (spaceUser) => {
  spaceUser = toRaw(spaceUser);
  router.push({ name: "Space", state: { spaceUser } });
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

onMounted(() => {
  state.isCollect = record?.collect.indexOf(tree._id) != -1;
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
        <img class="header__avator" :src="user.avator" @click="toSpace(user)" />
        <div class="header__info">
          <span class="info__name" @click="toSpace(user)">{{ user.name }}</span>
          <span class="info__time">{{ tree.time.split(" ")[0].substring(5).split("/").join("-") }}</span>
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
          <photo-consumer v-for="src in tree.imgs" :intro="src" :key="src" :src="src">
            <img :src="src" class="view-box" />
          </photo-consumer>
        </photo-provider>
      </div>
      <!-- 卡片-底部 -->
      <div class="main__footer" v-if="user._id != loginUser._id">
        <!-- 收藏 -->
        <i class="iconfont icon-shoucang-active" v-show="state.isCollect" @click="haddleCollect()"></i>
        <i class="iconfont icon-shoucang" v-show="!state.isCollect" @click="haddleCollect()"></i>
        <!-- 联系卖家 -->
        <el-button round @click="toSocket(loginUser._id, user._id, tree._id)">联系卖家</el-button>
      </div>
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
  }
}
</style>
