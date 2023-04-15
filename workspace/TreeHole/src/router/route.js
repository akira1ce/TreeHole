/*
 * @Author: Akira
 * @Date: 2022-11-14 09:56:23
 * @LastEditTime: 2023-02-20 16:04:20
 */
const Login = () => import("../view/Login.vue");
const Register = () => import("../view/Register.vue");
const Home = () => import("../view/Home.vue");
const Dynamic = () => import("../view/Dynamic.vue");
const Personal = () => import("../view/Personal.vue");
const Space = () => import("../view/Space.vue");
const Socket = () => import("../view/Socket.vue");
const Record = () => import("../view/Record.vue");
const Map = () => import("../view/Map.vue");
const OrderDetail = () => import("../view/OrderDetail.vue");
const TreeDetail = () => import("../view/TreeDetail.vue");

const routes = [
  { path: "/login", name: "Login", component: Login, meta: { title: "登录" } },
  { path: "/register", name: "Register", component: Register, meta: { title: "注册" } },
  { path: "/home", name: "Home", component: Home, meta: { title: "首页" } },
  { path: "/dynamic", name: "Dynamic", component: Dynamic, meta: { title: "动态中心" } },
  { path: "/personal", name: "Personal", component: Personal, meta: { title: "个人中心" } },
  { path: "/space", name: "Space", component: Space, meta: { title: "个人空间" } },
  { path: "/socket", name: "Socket", component: Socket, meta: { title: "会话中心" } },
  { path: "/record", name: "Record", component: Record, meta: { title: "记录中心" } },
  { path: "/map", name: "Map", component: Map, meta: { title: "地址详情" } },
  { path: "/orderDetail", name: "OrderDetail", component: OrderDetail, meta: { title: "订单详情" } },
  { path: "/treeDetail", name: "TreeDetail", component: TreeDetail, meta: { title: "苗木详情" } },
  { path: "/", redirect: "/home" },
];

export default routes;
