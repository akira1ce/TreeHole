const Login = () => import("../view/Login.vue");
const Register = () => import("../view/Register.vue");
const Home = () => import("../view/Home.vue");
const Dynamic = () => import("../view/Dynamic.vue");
const Personal = () => import("../view/Personal.vue");
const Space = () => import("../view/Space.vue");
const Socket = () => import("../view/Socket.vue");

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
  { path: "/", redirect: "/login" },
];

export default routes;
