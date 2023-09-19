import { https, loadingHttps } from '@/utils/https';
import {
  /** 用户管理 */
  USER_GET_SYS_USER_LIST,
  DELETE_USER,
  USER_FIND_PERMISSIONS,
  USER_GET_SYS_USER_DETAIL,
  USER_RESET_PASSWORD,
  USER_UPDATE_PASSWORD,
  USER_UPDATE_USER_STATUS,
  USER_GET_SIMPLE_USER_INFO_LIST,
  USER_FIND_USER_ROLES,
  USER_FIND_BY_NAME,
  USER_UPDATE_USER_INFO,
  USER_SAVE,
  GET_USER_INFO,
  /** 菜单管理 */
  FIND_PAGE_MENU,
  DELETE_MENU,
  MENU_SAVE,
  FIND_MENU_TREE,
  MENU_UPDATE,
  /** 字典管理 */
  FIND_PAGE_DICT,
  DELECT_DICT,
  SAVE_DICT,
  /** 登录日志 */
  FIND_PAGE_LOGINLOG,
  /** 操作日志 */
  FIND_PAGE_LOG,
  /** 注册审核 */
  REG_ENTERPRISE_FIND_PAGE,
  /** */
  SAVE_DEPT,
  DELETE_DEPT,
  FIND_TREE_DEPT,
  FIND_ALL_DEPT,
  QUERY_SYSTEM_ROLE_COMBO_BOX,
} from './api';
/** 用户管理 */
/**
 * @description: 获取用户管理信息列表
 * @param {type}
 * @return {type} Promise
 */
export const post_findPage_user = (data: Params) => {
  return https.post(USER_GET_SYS_USER_LIST, {
    data,
  });
};
/**
 * @description: 删除用户
 * @param {type}
 * @return {type}
 */
export const post_delete_user = (data: Params[]) => {
  return https.post(DELETE_USER, {
    data,
  });
};
/**
 * @description: 用户详情
 * @param {type}
 * @return {type}
 */
export const get_user_detail = (params: Params) => {
  return https.get(USER_GET_SYS_USER_DETAIL, {
    params,
  });
};
/**
 * @description: 用户详情
 * @param {type}
 * @return {type}
 */
export const get_user_info = () => {
  return https.get(GET_USER_INFO, {});
};

/**
 * @description: 用户管理-更新
 * @param {type}
 * @return {type}
 */
export const post_update_user_info = (data: Params) => {
  return https.post(USER_UPDATE_USER_INFO, {
    data,
  });
};
/**
 * @description: 用户管理-保存用户
 * @param {type}
 * @return {type}
 */
export const post_save_user = (data: Params) => {
  return https.post(USER_SAVE, {
    data,
  });
};

/**
 * @description: 用户管理-用户名查询用户信息
 * @param data
 * @return {type} Promise
 */
export const get_user_find_by_name = (params: Params) => {
  return https.get(USER_FIND_BY_NAME, {
    params,
  });
};

/**
 * @description: 用户管理-查找用户的角色集合
 * @param data
 * @return {type} Promise
 */
export const get_user_find_user_roles = (params: Params) => {
  return https.get(USER_FIND_USER_ROLES, {
    params,
  });
};

/**
 * @description: 用户管理-重置密码
 * @param data
 * @return {type} Promise
 */
export const post_user_reset_password = (params: Params) => {
  return https.post(USER_RESET_PASSWORD, {
    params,
  });
};

/**
 * @description: 用户管理-修改密码
 * @param data
 * @return {type} Promise
 */
export const post_user_update_password = (data: Params) => {
  return https.post(USER_UPDATE_PASSWORD, {
    data,
  });
};

/**
 * @description: 用户管理-用户的启停状态更新
 * @param data
 * @return {type} Promise
 */
export const get_user_update_user_status = (data: Params) => {
  return https.post(USER_UPDATE_USER_STATUS, {
    data,
  });
};

/**
 * @description: 获取用户按钮权限
 * @param {type}
 * @return {type}
 */
export const get_find_permissions = (name: string) => {
  return https.get(`${USER_FIND_PERMISSIONS}?name=${window.localStorage.getItem('userName')}`, {});
};

/** 菜单管理 */
/**
 * @description: 获取菜单列表
 * @param data
 * @return {type} Promise
 */
export const get_findPage_menu = (data: Params) => {
  return https.get(FIND_PAGE_MENU, {
    data,
  });
};
/**
 * @description: 删除列表
 * @param data
 * @return {type} Promise
 */
export const post_delete_menu = (data: Params[]) => {
  return https.post(DELETE_MENU, {
    data,
  });
};
/**
 * @description: 保存菜单
 * @param data
 * @return {type} Promise
 */
export const post_save_menu = (data: Params) => {
  return https.post(MENU_SAVE, {
    data,
  });
};

/**
 * @description: 修改菜单
 * @param data
 * @return {type} Promise
 */
export const post_update_menu = (data: Params) => {
  return https.post(MENU_UPDATE, {
    data,
  });
};

/**
 * @description: 获取角色菜单授权列表
 * @param {type}
 * @return {type}
 */
export const get_find_menu_tree = (data: Params) => {
  return https.get(FIND_MENU_TREE, {});
};

/**
 * @description: 获取字典菜单列表
 * @param data
 * @return {tpost_findpage_dict
 */
export const post_findpage_dict = (data: Params) => {
  return https.post(FIND_PAGE_DICT, { data });
};

/**
 * @description: 删除字典列表
 * @param {type} {id}
 * @return {type} Promise
 */
export const post_delete_dict = (data: Params) => {
  return https.post(DELECT_DICT, { data });
};

/**
 * @description: 新增字典
 * @param data
 * @return {type} Promise
 */
export const post_save_dict = (data: Params) => {
  return https.post(SAVE_DICT, { data });
};

/**
 * @description: 获取登录日志列表
 * @param data
 * @return {type} Promise
 */
export const post_findpage_loginlog = (data: Params) => {
  return https.post(FIND_PAGE_LOGINLOG, { data });
};

/**
 * @description: 获取操作日志列表
 * @param data
 * @return {type} Promise
 */
export const post_findpage_log = (data: Params) => {
  return https.post(FIND_PAGE_LOG, { data });
};

/**
 * @description:注册审核列表
 * @param {type}
 * @return {type}
 */
export const post_reg_find_page = (data: Params) => {
  return https.post(`${REG_ENTERPRISE_FIND_PAGE}`, {
    data,
  });
};

/**
 * @description:机构管理树
 * @param {type}
 * @return {type}
 */
export const post_dept_find_tree = () => {
  return https.get(`${FIND_TREE_DEPT}`, {});
};

/**
 * @description:删除机构管理树
 * @param {type}
 * @return {type}
 */
export const post_dept_delete = (data: Params) => {
  return https.post(`${DELETE_DEPT}`, {
    data,
  });
};

/**
 * @description:保存机构管理树
 * @param {type}
 * @return {type}
 */
export const post_deot_save = (data: Params) => {
  return https.post(`${SAVE_DEPT}`, {
    data,
  });
};
/**
 * @description:机构管理树
 * @param {type}
 * @return {type}
 */
export const post_dept_find_all = () => {
  return https.get(`${FIND_ALL_DEPT}`, {});
};

/**
 * @description: 获取所有系统 所有角色
 * @param {*}
 * @return {*}
 */
export const get_querySystemRoleComboBox = () => {
  return https.get(QUERY_SYSTEM_ROLE_COMBO_BOX, {});
};
