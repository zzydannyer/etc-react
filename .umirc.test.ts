/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/.umirc.test.ts
 * @Description: 测试环境配置
 */

import { defineConfig } from 'umi';
import chainWebpack from './config/webpack.config';
export default defineConfig({
  publicPath: '/',
  base: '/',
  outputPath: 'evdata-ets',
  chainWebpack,
  chunks: ['react', 'vendors', 'umi'],
  hash: true,
  define: {
    /**打包环境名称 */
    'process.env.B_ENV': 'test',
    // 退出跳转地址
    'process.env.LOGIN_URL': '/front/login',
    /**学生端超时 登录地址 */
    'process.env.STUDENT_LOGIN_URL': '/front/prevLogin',
   
  },
});
