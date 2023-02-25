/*
 * @Author: Akira
 * @Date: 2023-02-25 12:50:14
 * @LastEditTime: 2023-02-25 13:12:58
 */
import { request } from "@/utils/service"
import api from ".."
import type * as Tree from "./types/tree"

/** 增 */
export function AddTreeApi(data: Tree.ITree) {
  return request<Tree.AddTreeResponseData>({
    url: api.tree.addTree,
    method: "post",
    data
  })
}

/** 删 */
export function RemoveTreeApi(data: Tree.IRemoveTreeRequestData) {
  return request<Tree.RemoveTreeResponseData>({
    url: api.tree.removeById,
    method: "post",
    data
  })
}

/** 改 */
export function ModifyTreeApi(data: Tree.ITree) {
  return request<Tree.ModifyTreeResponseData>({
    url: api.tree.modifyById,
    method: "post",
    data
  })
}

/** 查 */
export function GetTreeApi(data: Tree.IGetTreeRequestData) {
  return request<Tree.GetTreeResponseData>({
    url: api.tree.getTreeList,
    method: "post",
    data
  })
}
