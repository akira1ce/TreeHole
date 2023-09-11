/*
 * @Author: Akira
 * @Date: 2022-11-14 16:56:50
 * @LastEditTime: 2023-02-20 15:58:41
 */
import { message } from 'antd';
import axios from 'axios';

const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: false,
});

// 请求拦截
service.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token') || undefined;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 响应拦截
service.interceptors.response.use((response) => {
  const res = response.data;
  console.log('Akira res: ', res);
  // 请求成功
  if (res.code === 200) {
    // 非 ok 弹窗展示信息
    if (res.message != 'ok') message.success(`Akira res: ${res.message}`);
    return res;
  } else if (res.code === 10000) {
    // 未登录
    window.location.href = '/login';
    localStorage.clear();
    return res;
  } else {
    // 请求失败
    message.error(`Akira res: ${res.message}`);
    return res;
  }
});

export default service;
