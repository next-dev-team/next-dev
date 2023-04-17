import { defineConfig } from '@umijs/max';
import { name as multiCameraApp } from '../multi-camera/package.json';

export default defineConfig({
  npmClient: 'pnpm',
  antd: {},
  model: {},
  layout: {
    title: 'NextDev App',
    navTheme: 'light',
    contentWidth: 'Fixed',
    fixedHeader: true,
    fixSiderbar: true,
    layout: 'top',
  },
  qiankun: {
    master: {
      apps: [
        {
          name: multiCameraApp,
          entry: 'http://192.168.100.14:8001', // your slave app address
        },
      ],
    },
    slave: {},
  },
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    { path: '/home', component: 'index', icon: 'SmileFilled', name: 'Home' },
    {
      path: `/${multiCameraApp}/*`,
      microApp: multiCameraApp,
      name: multiCameraApp,
      icon: 'SmileFilled',
    },
  ],
});
