/*
 * @Author: Akira
 * @Date: 2023-02-25 15:08:08
 * @LastEditTime: 2023-02-25 17:44:49
 */
import { type Directive } from "vue"
let isBind = false

/** 权限指令 */
export const loadmore: Directive = {
  updated(el, binding) {
    const selectTrigger = el.querySelector(".select-trigger")
    const id = selectTrigger.getAttribute("aria-describedby")
    const poper = document.getElementById(id)
    const SELECTDOWN_DOM = poper?.querySelector(".el-scrollbar .el-select-dropdown__wrap")
    if (!isBind && SELECTDOWN_DOM) {
      isBind = true
      SELECTDOWN_DOM.addEventListener("scroll", function () {
        /**
         * scrollHeight 获取元素内容高度(只读)
         * scrollTop 获取或者设置元素的偏移值,
         *  常用于:计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
         * clientHeight 读取元素的可见高度(只读)
         * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
         * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
         */
        const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (CONDITION) {
          binding.value()
        }
      })
    }
  }
}
