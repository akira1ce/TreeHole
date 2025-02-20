/*
 * @Author: Akira
 * @Date: 2023-02-22 19:02:48
 * @LastEditTime: 2023-04-13 10:41:40
 */
import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  // {
  //   path: "/redirect",
  //   component: Layout,
  //   meta: {
  //     hidden: true
  //   },
  //   children: [
  //     {
  //       path: "/redirect/:path(.*)",
  //       component: () => import("@/views/redirect/index.vue")
  //     }
  //   ]
  // },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          // svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/userManager",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/userManager/index.vue"),
        name: "UserManager",
        meta: {
          title: "用户管理"
          // svgIcon: "dashboard",
        }
      }
    ]
  },
  {
    path: "/treeManager",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/treeManager/index.vue"),
        name: "treeManager",
        meta: {
          title: "苗木管理"
          // svgIcon: "dashboard",
        }
      }
    ]
  },
  {
    path: "/orderManager",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/orderManager/index.vue"),
        name: "orderManager",
        meta: {
          title: "订单管理"
          // svgIcon: "dashboard",
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = []

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
