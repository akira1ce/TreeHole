import { defineConfig } from '@umijs/max';
import routeConfig from './config/route';

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
  routes: routeConfig.routes,
  npmClient: 'yarn',
});
