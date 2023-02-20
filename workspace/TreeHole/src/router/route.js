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
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/home", name: "Home", component: Home },
  { path: "/dynamic", name: "Dynamic", component: Dynamic },
  { path: "/personal", name: "Personal", component: Personal },
  { path: "/space", name: "Space", component: Space },
  { path: "/socket", name: "Socket", component: Socket },
  { path: "/record", name: "Record", component: Record },
  { path: "/map", name: "Map", component: Map },
  { path: "/orderDetail", name: "OrderDetail", component: OrderDetail },
  { path: "/treeDetail", name: "TreeDetail", component: TreeDetail },
  { path: "/", redirect: "/home" },
];

export default routes;
