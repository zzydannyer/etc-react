/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 13:01:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-22 15:15:08
 * @FilePath: /evdata-exam/src/commonServe/Sys/api.ts
 * @Description: 系统管理接口
 */
/**
 * 用户管理
 */
export const DELETE_USER = '/sysUser/delete';
export const USER_GET_SYS_USER_LIST = '/sysUser/findPage';
/**获取登录用户信息 */
export const GET_USER_INFO = '/sysUser/getUserInfo';
//用户详情
export const USER_GET_SYS_USER_DETAIL = '/sysUser/getSysUserDetail';
//重置密码
export const USER_RESET_PASSWORD = '/sysUser/resetPassword';
//修改密码
export const USER_UPDATE_PASSWORD = '/sysUser/updatePassword';
//添加用户
export const USER_SAVE = '/sysUser/save';
//用户的启停状态更新
export const USER_UPDATE_USER_STATUS = '/sysUser/updateStatus';
//查询用户信息列表
export const USER_GET_SIMPLE_USER_INFO_LIST = '/sysUser/getSimpleUserInfoList';
//查找用户的角色集合
export const USER_FIND_USER_ROLES = '/sysUser/findUserRoles';
//查找用户的菜单权限标识集合
export const USER_FIND_PERMISSIONS = '/sysUser/findPermissions';
//用户名查询用户信息
export const USER_FIND_BY_NAME = '/sysUser/findByName';
//更新
export const USER_UPDATE_USER_INFO = '/sysUser/update';

/**
 * 菜单管理
 */
export const FIND_PAGE_MENU = '/sysMenu/findSystemTree';
export const DELETE_MENU = '/sysMenu/delete';
export const MENU_SAVE = '/sysMenu/save';
export const MENU_UPDATE = '/sysMenu/update';
export const FIND_MENU_TREE = '/sysMenu/findSystemTree';

/**
 * 字典管理
 */
export const FIND_PAGE_DICT = '/dict/findPage';
export const DELECT_DICT = '/dict/delete';
export const SAVE_DICT = '/dict/save';

/**
 * 登录日志
 */
export const FIND_PAGE_LOGINLOG = '/loginlog/findPage';

/**
 * 操作日志
 */
export const FIND_PAGE_LOG = '/log/findPage';

/**
 * 注册审核
 */
export const REG_ENTERPRISE_FIND_PAGE = '/reg/regEnterprise/findPage';

/**
 * 机构管理
 */
export const FIND_TREE_DEPT = '/dept/findTree';
export const DELETE_DEPT = '/dept/delete';
export const SAVE_DEPT = '/dept/save';
export const FIND_ALL_DEPT = '/dept/findAll';

export const QUERY_SYSTEM_ROLE_COMBO_BOX = '/sysUser/querySystemRoleComboBox';
