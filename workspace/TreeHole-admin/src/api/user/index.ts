/*
 * @Author: Akira
 * @Date: 2023-02-22 19:02:48
 * @LastEditTime: 2023-02-23 18:08:21
 */
import { request } from "@/utils/service"
import api from ".."
import type * as User from "./types/user"

/** 登录并返回 Token */
export function loginApi(data: User.ILoginRequestData) {
  return request<User.LoginResponseData>({
    url: api.user.login,
    method: "post",
    data
  })
}

/** 增 */
export function AddUserApi(data: User.IAddUserRequestData) {
  return request<User.AddUserResponseData>({
    url: api.user.register,
    method: "post",
    data
  })
}

/** 删 */
export function RemoveUserApi(data: User.IRemoveUserRequestData) {
  return request<User.RemoveUserResponseData>({
    url: api.user.removeById,
    method: "post",
    data
  })
}

/** 改 */
export function ModifyUserApi(data: User.IModifyUserRequestData) {
  return request<User.ModifyUserResponseData>({
    url: api.user.modifyById,
    method: "post",
    data
  })
}

/** 查 */
export function GetUserApi() {
  return request<User.GetUserResponseData>({
    url: api.user.getUserList,
    method: "post"
  })
}
