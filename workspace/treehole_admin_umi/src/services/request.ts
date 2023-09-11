/*
 * @Author: Akira
 * @Date: 2022-11-14 17:06:45
 * @LastEditTime: 2023-03-03 17:19:35
 */
import instance from './interceptor';

interface IRes {
  code: number;
  data: {
    list?: any;
    count?: number;
    [key: string]: any;
  };
  msg: string;
}

/**
 * @param {url} 请求地址
 * @param {params} 请求参数
 * @param {method} 请求方式 get、post...
 */
function request(url: string, params: any, method: 'post' | 'get') {
  return new Promise<IRes>((resolve, reject) => {
    let data = {};
    // get请求使用params字段
    if (method == 'get') data = { params };
    // post请求使用data字段
    if (method == 'post') data = { data: params };
    instance({
      url,
      method,
      ...data,
    }).then((res: any) => {
      if (res.code === 200) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  });
}

// 封装GET请求
function get(url: string, params: any) {
  return request(url, params, 'get');
}
// 封装POST请求
function post(url: string, params: any) {
  return request(url, params, 'post');
}

export default {
  get,
  post,
};
