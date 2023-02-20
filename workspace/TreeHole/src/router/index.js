/*
 * @Author: Akira
 * @Date: 2022-11-14 09:59:42
 * @LastEditTime: 2023-02-20 16:04:07
 */
import routes from "./route";
import { createRouter, createWebHashHistory } from "vue-router";
import { local } from "../util";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (!local.getItem("token") && to.name != "Login" && to.name != "Register") return "/login";
});

export default router;
