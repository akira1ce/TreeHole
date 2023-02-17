<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import request from "../api/request";
import api from "../api";
import { local } from "../util";

const router = useRouter();
const formRef = ref();

// [state]
const user = reactive({
  account: "17756287961",
  password: "admin123",
});
const rules = reactive({
  account: [
    {
      required: true,
      message: "Please input Activity account",
      trigger: "blur",
    },
    { min: 3, max: 11, message: "Length should be 3 to 11", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "Please input Activity password",
      trigger: "blur",
    },
    { min: 5, max: 18, message: "Length should be 5 to 18", trigger: "blur" },
  ],
});

// [methods]
/**
 * 登陆
 * @param {object} formEl
 * @param {number} mode
 */
const Submit = async (formEl, mode) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (mode == 0) {
        if (!formEl) return;
        formEl.resetFields();
      } else if (mode == 1) {
        const { account, password } = user;
        const res = await request.post(api.user.login, { account, password });
        local.setItem("token", res.token);
        local.setItem("user", res.user);
        router.push({ name: "Home" });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// register
const toRegister = () => {
  router.push({ name: "Register" });
};

onMounted(() => {
  user.account = history.state.user?.account || user.account;
  user.password = history.state.user?.password || user.password;
});
</script>

<template>
  <div class="container">
    <!-- 登陆框 -->
    <div class="box">
      <div class="main">
        <h2 class="main-title">Welcome TreeHole 🙌</h2>
        <!-- 表单 -->
        <el-form :model="user" :rules="rules" label-width="50px" ref="formRef" class="main-form" @keydown.enter="Submit(formRef, 1)" status-icon>
          <!-- 账号 -->
          <el-form-item label="Account" prop="account">
            <el-input v-model="user.account"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="Password" prop="password">
            <el-input v-model="user.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="Submit(formRef, 0)">Reset</el-button>
            <el-button type="primary" @click="Submit(formRef, 1)">Sign in</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 注册 -->
    <el-button class="register" type="primary" round @click="toRegister">Sign Up</el-button>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
  min-height: 660px;
  background-image: url("../assets/loginBack.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    position: relative;
    width: 30%;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    z-index: 1;
    .main {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 1.667vw 3.333vw;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(0.833vw);
      box-shadow: 0 0.417vw 1.25vw rgba(0, 0, 0, 0.1);
      border-radius: 0.667vw;
      z-index: 1;
      transform: 0.5s;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .main-title {
        font-size: 2vw;
        padding-bottom: 1.667vw;
      }
      :deep(.main-form) {
        .el-form-item__label {
          color: #fff;
        }
      }
      .group {
        margin-top: 1.667vw;
        display: flex;
        justify-content: center;
        gap: 2.5vw;
      }
    }
  }

  .box::before {
    content: " ";
    position: absolute;
    top: 0;
    width: 90%;
    height: 100%;
    text-decoration: none;
    background: #fff;
    border-radius: 0.667vw;
    transform: skewX(15deg);
    transition: 0.5s;
  }

  .box:hover:before,
  .box:hover:after {
    transform: skewX(0deg) scaleX(1.3);
  }

  .box:before,
  .box:after {
    background: linear-gradient(315deg, rgb(20, 122, 76), rgb(119, 140, 68));
  }

  .register {
    position: absolute;
    top: 0;
    right: 0;
    margin: 1.667vw;
  }
}
</style>
