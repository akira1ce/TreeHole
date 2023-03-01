/*
 * @Author: Akira
 * @Date: 2023-02-24 13:30:42
 * @LastEditTime: 2023-02-28 15:28:48
 */
/** 统一处理 Cookie */

import CacheKey from "@/constants/cacheKey"
import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
  Cookies.set(CacheKey.TOKEN, token, { expires: 0.5 })
}
export const removeToken = () => {
  Cookies.remove(CacheKey.TOKEN)
}
