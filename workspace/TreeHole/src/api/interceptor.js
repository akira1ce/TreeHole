/*
 * @Author: Akira
 * @Date: 2022-11-14 16:56:50
 * @LastEditTime: 2023-02-20 15:58:41
 */
import axios from "axios";
import { ElMessage } from "element-plus";
import { local } from "../util";

const service = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: false,
});

// 请求拦截
service.interceptors.request.use((config) => {
  const token = local.getItem("token") || undefined;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 响应拦截
service.interceptors.response.use((response) => {
  const res = response.data;
  console.log(res);
  // 请求成功
  if (res.code === 200) {
    // 非 ok 弹窗展示信息
    if (res.message != "ok") ElMessage.success(res.message);
    return res;
  } else if (res.code === 10000) {
    // 未登录
    window.location.href = "/#/login";
    local.clear();
    return res;
  } else {
    // 请求失败
    ElMessage.error(res.message);
    return res;
  }
});

export default service;
