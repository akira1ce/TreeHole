import { type App } from "vue"
import { permission } from "./permission"
import { loadmore } from "./loadmore"

/** 挂载自定义指令 */
export function loadDirectives(app: App) {
  app.directive("permission", permission)
  app.directive("loadmore", loadmore)
}
