/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 13:01:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-03 17:50:42
 * @FilePath: /evdata-exam/.umirc.local.ts
 * @Description:
 */
import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: '/',
  // mfsu:{},
  define: {
    /**打包环境名称 */
    'process.env.B_ENV': 'local',
    // 退出跳转地址
    'process.env.LOGIN_URL': 'http://localhost:3000/front/login',
  },
  // devtool: 'eval',
  proxy: {
    // '/taobao-web/api/': {
    //   target: 'http://rap2.taobao.org:38080/app/mock/266352',
    //   changeOrigin: true,
    //   pathRewrite: { '^/taobao-web/api': '' },
    // },
    '/evdata-web/api/': {
      target:'http://127.0.0.1:8082',
      // target: 'http://172.16.14.37:8082',
      changeOrigin: true,
      pathRewrite: { '^/evdata-web/api': '/evdata-web/api' },
    },
    '/evdata-ets-api/api': {
      //target: proxyTarget,
      target:'http://127.0.0.1:8077/',
      // target: 'http://172.16.14.43:8077/',
      // target: 'http://106.14.202.68/',
      // target: 'http://172.16.14.28:8077/',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        '^/evdata-ets-api/api': '/evdata-ets',
      },
    },
    '/mock/api': {
      target: 'http://localhost:9090/',
      pathRewrite: {
        '^/mock/api': '/mock/api',
      },
    },
  },
});
