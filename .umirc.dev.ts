/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/.umirc.dev.ts
 * @Description: 开发环境
 */
import { defineConfig } from 'umi';
import chainWebpack from './config/webpack.config';
export default defineConfig({
  publicPath: '/',
  outputPath: 'evdata-ets',
  base: '/',
  chainWebpack,
  chunks: ['react', 'vendors', 'umi'],
  hash: true,
  define: {
    /**打包环境名称 */
    'process.env.B_ENV': 'dev',
    // 退出跳转地址
    'process.env.LOGIN_URL': '/front/login',
    /**学生端超时 退出 登录地址 */
    'process.env.STUDENT_LOGIN_URL': '/front/prevLogin',
  },
});
