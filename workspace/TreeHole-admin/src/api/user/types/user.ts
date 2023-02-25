/*
 * @Author: Akira
 * @Date: 2023-02-23 14:39:35
 * @LastEditTime: 2023-02-25 15:16:59
 */
export interface IUser {
  _id?: string
  account: string
  password?: string
  role: string
  avator?: string
  name: string
  sex: string
  location: string
  status: string
  __v?: number
  /** 索引 */
  [index: string]: any
}

/** 登陆 */
export interface ILoginRequestData {
  /** 账号 */
  account: string
  /** 密码 */
  password: string
}

/** 删 */
export interface IRemoveUserRequestData {
  /** 用户id */
  _id: string
}

/** 查 */
export interface IGetUserRequestData {
  pageNo: number
  limit: number
  account?: string | undefined
  name?: string | undefined
}

export type LoginResponseData = IApiResponseData<{ token: string; user: IUser }>
export type AddUserResponseData = IApiResponseData<{ user: IUser }>
export type RemoveUserResponseData = IApiResponseData<{ user: IUser }>
export type ModifyUserResponseData = IApiResponseData<{ user: IUser }>
export type GetUserResponseData = IApiResponseData<{ count: number; list: IUser[] }>
