/*
 * @Author: cmf
 * @Date: 2020-09-12 12:18:39
 * @LastEditTime: 2020-09-29 17:01:37
 * @LastEditors: Please set LastEditors
 * @Description: 平台端首页
 * @FilePath: \evdata-web-umi\src\commonServe\OrginfoManager\index.ts
 */
import { PLATFORM_FLOW_LIST, FLOW_DETAIL, NODE_DETAIL, BUTTON_SUBMIT } from './api';
import { https, loadingHttps } from '@/utils/https';
/**
 * @description: 获取企业信息列表
 * @param {type}
 * @return {type} Promise
 */
export const post_platformFlowList = (data: TableParams) => {
  return https.post(PLATFORM_FLOW_LIST, {
    data,
  });
};
/**
 * @description: 查询流程详情
 * @param {type}
 * @return {type}
 */
export const get_flowDetail = (id: number) => {
  return loadingHttps.get(`${FLOW_DETAIL}/${id}`, {});
};
/**
 * @description: 查询流程节点详情
 * @param {type}
 * @return {type}
 */
export const get_nodeDetail = (id: number) => {
  return loadingHttps.get(`${NODE_DETAIL}/${id}`, {});
};
/**
 * @description: 流程节点按钮提交
 * @param {type}
 * @return {type}
 */
export const post_buttonSubmit = (data: Params) => {
  return loadingHttps.post(`${BUTTON_SUBMIT}`, {
    data,
  });
};
