/*
 * @Author: your name
 * @Date: 2020-10-15 13:21:20
 * @LastEditTime: 2021-09-07 13:56:37
 * @LastEditors: Please set LastEditors
 * @Description: 角色接口
 * @FilePath: /evdata-exam/src/commonServe/role/index.tsx
 */

import { FIND_ALL, FIND_PAGE, DELETE, UPDATE, FIND_ROLE_MENUS, SAVE_ROLE_MENUS, SAVE } from './api';
import { loadingHttps, https } from '@/utils/https';
/**
 * @description:  查询全部
 * @param {type}
 * @return {type}
 */
export const get_find_all = (data: Params) => {
  return https.get(FIND_ALL, {});
};

/**
 * @description:  分页查询
 * @param {type}
 * @return {type}
 */
export const post_findPage = (data: Params) => {
  return https.post(FIND_PAGE, {
    data,
  });
};

/**
 * @description:  删除
 * @param {type}
 * @return {type}
 */
export const post_delete = (data: Params[]) => {
  return loadingHttps.post(DELETE, {
    data,
  });
};

/**
 * @description:  更新
 * @param {type}
 * @return {type}
 */
export const post_update = (data: Params) => {
  return loadingHttps.post(UPDATE, {
    data,
  });
};

/**
 * @description:  新增
 * @param {type}
 * @return {type}
 */
export const post_save = (data: Params) => {
  return loadingHttps.post(SAVE, {
    data,
  });
};

/**
 * @description:  权限菜单
 * @param {type}
 * @return {type}
 */
export const get_find_role_menus = (roleId: number) => {
  return loadingHttps.get(`${FIND_ROLE_MENUS}?roleId=${roleId}`, {});
};
/**
 * @description:  保存角色权限菜单
 * @param {type}
 * @return {type}
 */
export const post_save_role_menus = (data: Params) => {
  return loadingHttps.post(`${SAVE_ROLE_MENUS}`, {
    data,
  });
};
