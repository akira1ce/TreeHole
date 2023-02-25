/*
 * @Author: Akira
 * @Date: 2023-02-25 12:50:41
 * @LastEditTime: 2023-02-25 18:22:12
 */

import { IUser } from "@/api/user/types/user"

export interface ITree {
  _id?: string
  ownerID: string
  owner?: IUser | null
  type: string
  height: string
  crownDiameter: string
  diameter: string
  branchPoint: string
  location: string
  describe: string
  imgs?: Array<string>
  price: string
  time?: string
  title: string
  status: string
  hci: number
  __v?: number
  /** 索引 */
  [index: string]: any
}


/** 删 */
export interface IRemoveTreeRequestData {
  /** 苗木id */
  _id: string
}

/** 查 */
export interface IGetTreeRequestData {
  pageNo: number
  limit: number
  type: string | undefined
  location: string | undefined
}

export type AddTreeResponseData = IApiResponseData<{ tree: ITree }>
export type RemoveTreeResponseData = IApiResponseData<{ tree: ITree }>
export type ModifyTreeResponseData = IApiResponseData<{ tree: ITree }>
export type GetTreeResponseData = IApiResponseData<{ count: number; list: ITree[] }>
