import { defineConfig } from '@umijs/max';

const routeConfig = defineConfig({
  routes: [
    {
      path: '/',
      redirect: '/chatOps',
    },
    // {
    //   name: 'UserManage',
    //   path: '/UserManage',
    //   component: './UserManage',
    // },
    {
      name: '保障工单ST-20230903-0098N3',
      path: '/chatOps',
      component: './ChatOps',
      menuRender: false,
    },
    // {
    //   name: 'EatWhat',
    //   path: '/eatwhat',
    //   component: './EatWhat',
    // },
  ],
});

export default routeConfig;
