const Login = () => import("../view/Login.vue");
const Register = () => import("../view/Register.vue");
const Home = () => import("../view/Home/Home.vue");
const Recommend = () => import("../view/Home/Recommend.vue");
const Area = () => import("../view/Home/Area.vue");
const Dynamic = () => import("../view/Dynamic.vue");
const Personal = () => import("../view/Personal.vue");
const Space = () => import("../view/Space.vue");
const Socket = () => import("../view/Socket.vue");
const Record = () => import("../view/Record.vue");
const Map = () => import("../view/Map.vue");

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/home/recommend",
    children: [
      {
        path: "recommend",
        name: "Recommend",
        component: Recommend,
      },
      {
        path: "area",
        name: "Area",
        component: Area,
      },
    ],
  },
  {
    path: "/dynamic",
    name: "Dynamic",
    component: Dynamic,
  },
  {
    path: "/personal",
    name: "Personal",
    component: Personal,
  },
  {
    path: "/space",
    name: "Space",
    component: Space,
  },
  {
    path: "/socket",
    name: "Socket",
    component: Socket,
  },
  {
    path: "/record",
    name: "Record",
    component: Record,
  },
  {
    path: "/map",
    name: "Map",
    component: Map,
  },
  { path: "/", redirect: "/home" },
];

export default routes;
