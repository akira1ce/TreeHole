/*
 * @Author: Akira
 * @Date: 2023-02-23 14:39:35
 * @LastEditTime: 2023-02-23 18:06:36
 */
export interface IUser {
  _id: string
  account: string
  password?: string
  role: string
  avator: string
  name: string
  sex: string
  location: string
  __v?: number
}

/** 登陆 */
export interface ILoginRequestData {
  /** 账号 */
  account: string
  /** 密码 */
  password: string
}

/** 增 */
export interface IAddUserRequestData {
  /** 账号 */
  account: string
  /** 密码 */
  password: string
  /** 角色 */
  role: string
}

/** 删 */
export interface IRemoveUserRequestData {
  /** 用户id */
  _id: string
}

/** 改 */
export interface IModifyUserRequestData {
  _id: string
  [propeName: string]: any
}

export type LoginResponseData = IApiResponseData<{ token: string; user: IUser }>
export type AddUserResponseData = IApiResponseData<{ user: IUser }>
export type RemoveUserResponseData = IApiResponseData<{ user: IUser }>
export type ModifyUserResponseData = IApiResponseData<{ user: IUser }>
export type GetUserResponseData = IApiResponseData<{ count: number; list: IUser[] }>
