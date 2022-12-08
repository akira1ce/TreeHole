<script setup>
import { reactive } from "vue";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3000");

let msg = reactive("");
let msgList = reactive([
  { content: "1", sender: "a" },
  { content: "2", sender: "b" },
]);

function send() {
  socket.emit("sendMessage", { content: "1", sender: "a" });
  msg = "";
}

socket.on("sendMessage", function (msg) {
  if (msg.sender == "a") console.log("存数据");
  msgList.push(msg);
  window.scrollTo(0, document.body.scrollHeight);
});
</script>

<template>
  <div>
    <ul id="messages">
      <li v-for="item in msgList" :class="item.sender == 'b' ? 'right' : 'left'">
        {{ item.content }}
      </li>
    </ul>
    <button @click="send">Send</button>
  </div>
</template>

<style scoped>
#form {
  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 3rem;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}
#input {
  border: none;
  padding: 0 1rem;
  flex-grow: 1;
  border-radius: 2rem;
  margin: 0.25rem;
}
#input:focus {
  outline: none;
}
#form > button {
  background: #333;
  border: none;
  padding: 0 1rem;
  margin: 0.25rem;
  border-radius: 3px;
  outline: none;
  color: #fff;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
#messages > li {
  width: 500px;
  padding: 0.5rem 1rem;
}
.right {
  text-align: right;
  display: block;
  float: right;
}
.left {
  float: left;
}
</style>
