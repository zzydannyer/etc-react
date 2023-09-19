/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/.umirc.ts
 * @Description: 基础配置
 */

import { defineConfig } from 'umi';
import routes from './config/router';
export default defineConfig({
  base: '/',
  nodeModulesTransform: {
    type: 'all',
  },
  // history: { type: 'hash' },
  // plugins: ['@alitajs/keep-alive'],
  // keepalive: ['/baseInfo/stationinfo'],
  routes,
  /**启用按需加载 */
  dynamicImport: {
    loading: '@/Loading',
  },
  // externals: {
  //   react: 'window.React',
  //   'react-dom': 'window.ReactDOM',
  // },
  favicon: '/favicon.ico',
  headScripts: [],
  dva: {
    immer: false,
  },
  mfsu: {
    // production:{}
  },

  // fastRefresh: {},
  targets: {
    ie: 11,
  },
});
