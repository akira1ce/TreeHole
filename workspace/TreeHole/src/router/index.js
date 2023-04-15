/*
 * @Author: Akira
 * @Date: 2022-11-14 09:59:42
 * @LastEditTime: 2023-04-14 15:07:50
 */
import routes from "./route";
import { createRouter, createWebHashHistory } from "vue-router";
import { local } from "../util";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const { title } = to.meta;
  document.title = `TreeHoles-${title}` || "TreeHoles";
  if (!local.getItem("token") && to.name != "Login" && to.name != "Register") return "/login";
});

export default router;
