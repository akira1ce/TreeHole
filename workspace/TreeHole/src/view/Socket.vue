<script setup>
import { computed, onMounted, reactive } from "vue-demi";
import api from "../api";
import request from "../api/request";
import { local } from "../util";

const user = local.getItem("user");

// [state]
const state = reactive({
  current: 0,
  text: "",
  socketList: [],
});

// [methods]
// 切换用户
const selectOtherSide = (e) => {
  const id = e.target.dataset?.id || e.target.parentNode.dataset?.id;
  if (state.current == id || id == undefined) return;
  state.current = id;
};

// 发送信息
const sendMsg = async () => {
  const senderID = user._id;
  const content = state.text;
  const time = new Date().toLocaleString();
  currentSocket.value.context.push({
    data: {
      content,
      type: 1,
    },
    senderID,
  });
};

// [computed]
// 当前聊天内容
const currentSocket = computed(() => {
  return state.socketList[state.current];
});

onMounted(async () => {
  const params = { userID: user._id };
  state.socketList = await request.post(api.socket.getSocketByUserID, params);
});
</script>

<template>
  <div class="container">
    <div class="container__userList" @click="selectOtherSide">
      <div class="userList__item" :id="state.current == index && 'active'" :data-id="index" :key="item._id" v-for="(item, index) in state.socketList">
        <img :src="item.otherSide.avator" />
        <span>{{ item.otherSide.name }}</span>
      </div>
    </div>
    <div class="container__dialog">
      <div class="dialog__title">{{ currentSocket?.otherSide.name }}</div>
      <div class="dialog__msgList scroll">
        <div class="msgList__item" :class="item.senderID == user._id ? 'flexEnd' : 'flexStart'" v-for="item in currentSocket?.context">
          <img class="item__img" :src="item.senderID == user._id ? user.avator : currentSocket?.otherSide.avator" />
          <div class="item__content">{{ item.data.content }}</div>
        </div>
      </div>
      <div class="dialog__sendBox">
        <input class="sendBox-input" placeholder="发个信息聊聊呗~" type="text" name="text" v-model="state.text" />
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
    height: 100%;
    padding: 25px 15px;
    background-color: white;
    border-right: 1px solid rgb(241, 242, 243);
    .userList__item {
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
  .container__dialog {
    .flex__column();
    flex: 1;
    height: 100%;
    background-color: rgb(241, 242, 243);
    .dialog__title {
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 18px;
      background-color: white;
    }
    .dialog__msgList {
      .flex__column();
      flex: 1;
      overflow: scroll;
      padding: 10px;
      position: relative;
      .msgList__item {
        .flex__row();
        gap: 10px;
        align-items: center;
        padding: 10px;
        .item__img {
          width: 40px;
          border-radius: 40px;
          margin-right: 12px;
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
      font-family: PingFang SC, Microsoft YaHei;
      .sendBox-input {
        flex: 1;
        height: 20px;
        padding: 12px;
        outline: none;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-family: inherit;
        background-color: rgb(241, 242, 243);
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        &:active {
          transform: scale(0.99);
        }
      }
      .sendBox-send {
        font-family: inherit;
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
