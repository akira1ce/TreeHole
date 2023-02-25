/*
 * @Author: Akira
 * @Date: 2023-02-22 19:02:48
 * @LastEditTime: 2023-02-25 12:21:01
 */
import { ref, reactive } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { loginApi, getUserInfoApi } from "@/api/login"
import { type ILoginRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"
import { IUser } from "@/api/user/types/user"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")
  const user = reactive<IUser>({
    account: "admin",
    avator: "http://127.0.0.1:5000/uploadCenter/files/1672479218174-avator4.jpg",
    location: "安徽-铜陵",
    name: "Admin",
    role: "2",
    sex: "1",
    status: "1",
    __v: 0,
    _id: "636616c07a179f73dd085492"
  })

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = (loginData: ILoginRequestData) => {
    return new Promise((resolve, reject) => {
      loginApi({
        account: loginData.account,
        password: loginData.password
      })
        .then((res) => {
          console.log(res)
          setToken(res.data.token)
          token.value = res.data.token
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((res) => {
          roles.value = res.data.roles
          username.value = res.data.account
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /** 登出 */
  const logout = () => {
    removeToken()
    localStorage.removeItem('USERID')
    token.value = ""
    roles.value = []
    resetRouter()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return { token, roles, username, setRoles, login, getInfo, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
