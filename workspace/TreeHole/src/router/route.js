const Login = () => import("../view/Login.vue");
const Home = () => import("../view/Home.vue");
const Register = () => import("../view/Register.vue");

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
  { path: "/", redirect: "/login" },
];

export default routes;
