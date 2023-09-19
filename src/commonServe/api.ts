/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 13:01:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-22 15:17:08
 * @FilePath: /evdata-exam/src/commonServe/api.ts
 * @Description: 统一接口
 */
export const GET_MAIN_MENU = '/base/syresource/doNotNeedSecurity_getMainMenu';
export const GET_SYUSER_ALLSSO = '/web/base/syuserAllSSO';
// 很多状态查询的统一接口
export const DO_NOT_NEED_SECURITY_QUERY_CODE = '/base/syutil/doNotNeedSecurity_queryCode';
export const BATCH_DATA_LIST = '/base/batchDataList';
export const GET_USER_INFO = '/sysUser/getUserInfo';

export const FIND_NAV_TREE = '/sysUser/findLeftTree';

export const LOGIN = '/login';

export const LOGOUT = '/logout';

export const GET_STATIC_CHOOSE_MAP = '/sysDictionary/queryInitComboBox';
/**获取accessToken */
export const GET_ACCESS_TOKEN = '/student/auth/getAccessToken';
/**获取getStudentToken */
export const GET_STUDENT_TOKEN = '/student/auth/getStudentToken';
/**获取oss文件下载地址 */
export const GET_TEMP_URL = '/oss/getTempUrl';

export const QUERY_SYSTEM_ROLE_COMBO_BOX = '/sysUser/querySystemRoleComboBox';
/**注销一网通办 */
export const LOGOUT_YWTB = 'https://center1.sheitc.sh.gov.cn/center/user/logout';
