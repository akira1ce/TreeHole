/*
 * @Author: Akira
 * @Date: 2023-02-27 15:02:05
 * @LastEditTime: 2023-02-27 15:02:21
 */
import { request } from "@/utils/service"
import api from ".."

/** 删 */
export function RemoveFileApi(data: { filename: string }) {
  return request({
    url: api.uploadCenter.remove,
    method: "post",
    data
  })
}
