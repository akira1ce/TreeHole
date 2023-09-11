import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  dva: {},
  model: {},
  initialState: {},
  locale: {
    default: 'en-US',
    baseSeparator: '-',
    useLocalStorage: true,
  },
  layout: {
    title: 'TreeHole-Admin',
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
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
  npmClient: 'yarn',
});
