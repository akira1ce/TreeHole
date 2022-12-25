<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import request from "../api/request";
import api from "../api";

const router = useRouter();

// [state]
const formRef = ref();
const user = reactive({
  account: "",
  password: "",
  role: 0,
});

const rules = reactive({
  account: [
    {
      required: true,
      message: "Please input Activity account",
      trigger: "blur",
    },
    { min: 3, max: 10, message: "Length should be 3 to 10", trigger: "blur" },
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
 * 注册
 * @param {object} formEl 
 * @param {number} mode 
 */
const Submit = async (formEl, mode) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        if (mode == 0) {
          // reset
          if (!formEl) return;
          formEl.resetFields();
        } else if (mode == 1) {
          // register
          const { account, password, role } = user;
          const params = {
            account,
            password,
            role,
          };
          const res = await request.post(api.user.register, params);
          router.push({
            name: "Login",
            state: { user: res },
          });
        }
      } catch (e) {
        console.log(`output->e`, e);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// router to login
const toLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div class="container">
    <div class="box">
      <div class="main">
        <h2 class="main-title">Welcome TreeHole 🙌</h2>
        <el-form :model="user" :rules="rules" label-width="50px" ref="formRef" class="main-form" status-icon>
          <el-form-item label="Account" prop="account">
            <el-input v-model="user.account"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="user.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="Submit(formRef, 0)">Reset</el-button>
            <el-button type="primary" @click="Submit(formRef, 1)">Sign up</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-button class="login" type="primary" round @click="toLogin">Sign In</el-button>
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
      .main-form:deep {
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

  .login {
    position: absolute;
    top: 0;
    right: 0;
    margin: 1.667vw;
  }
}
</style>
