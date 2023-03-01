/*
 * @Author: Akira
 * @Date: 2023-02-28 09:53:41
 * @LastEditTime: 2023-02-28 09:54:02
 */
import { ITree } from "@/api/tree/types/tree"
import { IUser } from "@/api/user/types/user"
import { type } from "os"
export interface IOrder {
  treeID: string
  tree: ITree
  buyerID: string
  buyer?: IUser
  sellerID: string
  seller?: IUser
  status: string
  time: string
  payTime: string
  refer?: number
}

export interface IRemoveOrderRequestData {
  _id: string
}

export interface IGetOrderRequestData {
  pageNo: number
  limit: number
  type?: string
  userID?: string
}

export type RemoveOrderResponseData = IApiResponseData<{ order: IOrder }>
export type GetOrderResponseData = IApiResponseData<{ count: number; list: IOrder[] }>
export type GetDataAnalyseResponseData = IApiResponseData<{
  userCount: number
  treeCount: number
  orderCount: number
  weeklyVolume: number[]
  popularType: { name: string; value: number }[]
}>
