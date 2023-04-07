<!--
 * @Author: Akira
 * @Date: 2022-11-16 17:02:41
 * @LastEditTime: 2023-04-07 15:13:35
-->
<script setup>
import api from "../api";
import { defaultState, local } from "../util";
import request from "../api/request";
import { io } from "socket.io-client";
import { ElMessage } from "element-plus";
import { computed, nextTick, onBeforeUnmount, onDeactivated, onMounted, reactive, ref, toRaw } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import DialogCard from "../components/DialogCard.vue";

const router = useRouter();
const route = useRoute();

const dialogRef = ref(null);

const socket = io("ws://localhost:3000");
const socketCallback = async (msg) => {
  const { socketList, current } = state;
  // 接收方 数据缓存
  if (currentSocket.value.otherSide._id == msg.senderID) socketList[current].context.push(msg);
  else {
    for (let i = 0; i < socketList.length; i++) {
      if (socketList[i].otherSide._id == msg.senderID) socketList[i].context.push(msg);
    }
  }
  // 发送方 数据缓存 + 存储
  if (msg.senderID == loginUser._id) {
    socketList[current].context.push(msg);
    const _id = currentSocket.value._id;
    // 更新数据
    await request.post(api.socket.modifyById, { _id, msg });
  }
  downScroll();
};

// socket 信息中转
socket.on("sendMessage", socketCallback);

const loginUser = local.getItem("user");
const userID = history.state.userID;
const treeID = history.state.treeID;

const state = reactive({
  current: -1,
  text: "",
  socketList: [],
  record: defaultState.record,
  pageNo: 1,
  limit: 12,
  infiniteScroll: false,
});

/**
 * 订单操作
 * - 立即购买 code 0
 * - 等待购买 code -1
 * @param {object} tree
 * @param {number} code
 */
const orderOp = async (tree, code) => {
  tree = toRaw(tree);
  const { socketList, current } = state;
  const { title, describe, price } = tree;

  if (code == -1) return;
  if (code == 0) {
    /** 新增订单 */
    const order = await request.post(api.order.addOrder, { treeID: tree._id, tree, buyerID: loginUser._id, sellerID: tree.ownerID });

    /** 支付宝支付 */
    await request.post(api.tree.modifyById, { _id: tree._id, status: "1" });
    const payUrl = await request.post(api.alipay.pagePay, { orderID: order._id, title, describe, price });

    socketList[current].tree.status = 1;
    ElMessage.success("购买成功");
    window.open(payUrl);
  }
};

/** 下放滚动条 */
const downScroll = () => {
  nextTick(() => {
    dialogRef.value.scrollTop = dialogRef.value.scrollHeight;
  });
};

/**
 * 移除聊天
 * @param {string} _id
 * @param {number} index
 */
const removeSocket = async (userID, socketID, index) => {
  await request.post(api.record.modifyRecordSocket, { userID, socketID });
  state.socketList.splice(index, 1);
  state.current = -1;
  history.state.userID = null;
  history.state.treeID = null;
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

/** 切换用户 */
const selectOtherSide = (e) => {
  const id = e.target.dataset?.id || e.target.parentNode.dataset?.id || e.target.parentNode.parentNode.dataset?.id;
  if (state.current == id || id == undefined) return;
  state.current = id;
  downScroll();
};

/** 发送信息 */
const sendMsg = async () => {
  const senderID = loginUser._id;
  const content = state.text;
  const time = new Date().toLocaleString();
  const msg = {
    data: {
      content,
      type: 1,
    },
    senderID,
    time,
  };

  /** 空白特判 */
  if (content == "") {
    ElMessage.warning("信息内容不能为空喔~");
    return;
  }

  /** 触发 socket 回调 */
  socket.emit("sendMessage", msg);

  state.text = "";
};

/** 获取会话列表 */
const getSocketList = async () => {
  const { pageNo, limit, record } = state;

  const sockets = await request.post(api.socket.getSocketListByID, { sockets: record.socket, pageNo, limit });
  sockets.forEach((item) => {
    if (loginUser._id == item.userID1) item.otherSide = item.user2;
    else item.otherSide = item.user1;
  });
  if (sockets.length == 0) state.infiniteScroll = true;
  state.socketList.push(...sockets);
  state.pageNo++;
};

/** 当前会话 */
const currentSocket = computed(() => {
  return state.socketList[state.current];
});

const isEmpty = computed(() => {
  return state.socketList.length == 0;
});

onMounted(async () => {
  try {
    state.record = await request.post(api.record.getRecordByUserID, { userID: loginUser._id });
    /** 获取会话列表 */
    await getSocketList();
    /** 存在指定用户 */
    if (userID) {
      state.socketList.some((item, index) => {
        if ((item.userID1 == userID || item.userID2 == userID) && item.treeID == treeID) {
          state.current = index;
          return true;
        }
      });
    }
    /** 下放滚动条 */
    downScroll();
  } catch (error) {
    ElMessage.error(error.message);
  }
});

onBeforeUnmount(() => {
  socket.off("sendMessage", socketCallback);
  socket.close();
});
</script>

<template>
  <div class="container">
    <!-- 聊天列表 -->
    <div class="container__userList scroll" @click="selectOtherSide" v-infinite-scroll="getSocketList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
      <div v-if="isEmpty">
        <span>你还没有联系任何人喔~</span>
      </div>
      <div class="userList__item" v-for="(item, index) in state.socketList" :id="state.current == index && 'active'" :data-id="index" :key="item._id">
        <div class="item__left">
          <img :src="item.otherSide?.avator || 'https://s2.loli.net/2023/02/28/PtfNEqQHhxTcAbk.png'" />
          <span>{{ item.otherSide?.name || "该用户已注销" }}</span>
        </div>
        <i class="iconfont icon-lajitong" @click="removeSocket(loginUser._id, item._id, index)"></i>
      </div>
    </div>
    <el-empty class="container__dialog" description="去找树友聊天吧~" v-show="state.current == -1" />
    <!-- 对话框 -->
    <div class="container__dialog" v-show="state.current != -1">
      <!-- 标题 -->
      <div class="dialog__title" @click="toSpace(currentSocket?.otherSide)">{{ currentSocket?.otherSide?.name || "该用户已注销" }} {{ currentSocket?.otherSide?.sex == 1 ? "🤦‍♂️" : "🤦‍♀️" }}</div>
      <!-- 信息列表 -->
      <div class="dialog__msgList scroll" ref="dialogRef">
        <!-- 对话框苗木卡片 -->
        <DialogCard v-if="currentSocket?.tree" :key="currentSocket?.treeID" :tree="currentSocket?.tree" :loginUser="loginUser" :orderOp="orderOp" />
        <div class="msgList__item" :class="item.senderID == loginUser._id ? 'flexEnd' : 'flexStart'" v-for="item in currentSocket?.context">
          <img class="item__img" :src="item.senderID == loginUser._id ? loginUser.avator : currentSocket?.otherSide.avator" />
          <div class="item__content">{{ item.data.content }}</div>
        </div>
      </div>
      <!-- 输入框 -->
      <div class="dialog__sendBox">
        <input class="sendBox-input" placeholder="发个信息聊聊呗~" autocomplete="off" type="text" name="text" v-model="state.text" @keydown.enter="sendMsg" />
        <button class="sendBox-send" @click="sendMsg">
          <div class="svg-wrapper-1">
            <div class="svg-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
              </svg>
            </div>
          </div>
          <span>Send</span>
        </button>
      </div>
    </div>
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
  .flex__row();
  height: calc(100vh - 76px);
  overflow: hidden;
  position: relative;
  background-color: @defaultColor;
  .container__userList {
    .flex__column();
    width: 230px;
    overflow-y: overlay;
    padding: 15px;
    background-color: white;
    border-right: 1px solid rgb(241, 242, 243);
    .userList__item {
      .flex__row();
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      border-radius: 12px;
      transition: all 0.5s;
      img {
        width: 36px;
        border-radius: 36px;
        margin-right: 12px;
      }
      &:hover {
        background-color: @deepDefaultColor;
        .icon-lajitong {
          display: block;
        }
      }
      .item__left {
        .flex__row();
        flex: 1;
        align-items: center;
      }
      .icon-lajitong {
        font-size: 20px;
        display: none;
        cursor: pointer;
      }
    }
    #active {
      background-color: @defaultColor;
    }
  }
  .container__dialog {
    .flex__column();
    flex: 1;
    height: 100%;
    overflow: hidden;
    background-color: rgb(241, 242, 243);
    .dialog__title {
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 18px;
      transition: all 0.5s;
      background-color: white;
      cursor: pointer;
    }
    .dialog__msgList {
      .flex__column();
      flex: 1;
      overflow: scroll;
      padding: 10px;
      position: relative;
      .msgList__tree {
        margin: 0 50px;
      }
      .msgList__item {
        .flex__row();
        gap: 10px;
        align-items: center;
        padding: 10px;
        .item__img {
          width: 40px;
          border-radius: 40px;
          align-self: flex-start;
        }
        .item__content {
          max-width: 40%;
          padding: 15px;
          overflow: hidden;
          word-break: break-all;
          border-radius: 10px;
          background-color: white;
        }
      }
      .flexStart {
        justify-content: flex-start;
        .item__content {
          border-top-left-radius: 0px;
        }
      }
      .flexEnd {
        flex-direction: row-reverse;
        justify-content: flex-start;
        .item__content {
          border-top-right-radius: 0px;
        }
      }
    }
    .dialog__sendBox {
      .flex__row();
      gap: 5px;
      padding: 10px;
      position: relative;
      background-color: white;
      .sendBox-input {
        flex: 1;
        height: 20px;
        padding: 12px;
        outline: none;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        background-color: rgb(241, 242, 243);
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        &:active {
          transform: scale(0.99);
        }
      }
      .sendBox-send {
        font-size: 16px;
        background: @activeColor;
        color: white;
        padding: 10px;
        display: flex;
        align-items: center;
        border: none;
        border-radius: 10px;
        overflow: hidden;
        transition: all 0.2s;
        span {
          display: block;
          margin-left: 0.3em;
          transition: all 0.3s ease-in-out;
        }
        svg {
          display: block;
          transform-origin: center center;
          transition: transform 0.3s ease-in-out;
        }
        &:hover {
          .svg-wrapper {
            animation: fly-1 0.6s ease-in-out infinite alternate;
          }
          svg {
            transform: translateX(1.2em) rotate(45deg) scale(1.1);
          }
          span {
            transform: translateX(5em);
          }
        }
        &:active {
          transform: scale(0.95);
        }
      }
      @keyframes fly-1 {
        from {
          transform: translateY(0.1em);
        }
        to {
          transform: translateY(-0.1em);
        }
      }
    }
  }
}
</style>
