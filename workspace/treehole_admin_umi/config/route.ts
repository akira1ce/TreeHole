import { defineConfig } from '@umijs/max';

const routeConfig = defineConfig({
  routes: [
    {
      path: '/',
      redirect: '/UserManage',
    },
    {
      name: 'UserManage',
      path: '/UserManage',
      component: './UserManage',
    },
    {
      name: 'Access',
      path: '/access',
      component: './Access',
    },
    {
      name: 'EatWhat',
      path: '/eatwhat',
      component: './EatWhat',
    },
  ],
});

export default routeConfig;
