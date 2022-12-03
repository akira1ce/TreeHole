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
  if (res.code === 200) {
    if (res.message != "ok") ElMessage.success(res.message);
    return res;
  } else if (res.code === 10000) {
    window.location.href = "/#/login";
    local.clear();
    return res;
  } else {
    ElMessage.error(res.message);
    return res;
  }
});

export default service;
