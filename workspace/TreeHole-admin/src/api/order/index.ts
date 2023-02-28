/*
 * @Author: Akira
 * @Date: 2023-02-28 09:53:28
 * @LastEditTime: 2023-02-28 11:09:29
 */
import { request } from "@/utils/service"
import api from ".."
import type * as Order from "./types/order"

/** 删 */
export function RemoveOrderApi(data: Order.IRemoveOrderRequestData) {
  return request<Order.RemoveOrderResponseData>({
    url: api.order.removeById,
    method: "post",
    data
  })
}

/** 查 */
export function GetOrderApi(data: Order.IGetOrderRequestData) {
  return request<Order.GetOrderResponseData>({
    url: api.order.getOrderList,
    method: "post",
    data
  })
}
