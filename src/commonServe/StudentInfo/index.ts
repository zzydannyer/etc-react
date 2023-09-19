import { https, loadingHttps } from '@/utils/https';
import {
  EVDATA_ETS_STUDENT_INFO_DOWNLOAD,
  EVDATA_ETS_STUDENT_INFO_FIND_BY_ID,
  EVDATA_ETS_STUDENT_INFO_FIND_PAGE,
  EVDATA_ETS_STUDENT_INFO_IMPORT_EXCEL,
  EVDATA_ETS_STUDENT_INFO_UPDATE,
  EVDATA_ETS_STUDENT_INFO_UPDATE_STATUS,
} from './api';

/**
 * @description: 获取学员信息
 * @param {*}
 * @return {*}
 */
export const post_findPage_student = (data: Params) => {
  return https.post(EVDATA_ETS_STUDENT_INFO_FIND_PAGE, {
    data,
  });
};
/**
 * @description: 下载excel导入模板
 * @param {Params} data
 * @return {*}
 */
export const get_download_student = (data: Params) => {
  return https.get(EVDATA_ETS_STUDENT_INFO_DOWNLOAD, {
    data,
  });
};
/**
 * @description: excel导入
 * @param {Params} data
 * @return {*}
 */
export const post_importExcel_student = (data: Params) => {
  return https.post(EVDATA_ETS_STUDENT_INFO_IMPORT_EXCEL, {
    data,
  });
};
/**
 * @description: 查看学员详情
 * @param {Params} data
 * @return {*}
 */
export const get_find_studentInfo = (params: Params) => {
  return https.get(EVDATA_ETS_STUDENT_INFO_FIND_BY_ID, {
    params,
  });
};
/**
 * @description: 修改学员
 * @param {Params} data
 * @return {*}
 */
export const post_updata_student = (data: Params) => {
  return https.post(EVDATA_ETS_STUDENT_INFO_UPDATE, {
    data,
  });
};
/**
 * @description: 修改学员状态
 * @param {Params} data
 * @return {*}
 */
export const post_updata_studentStatus = (data: Params) => {
  return https.post(EVDATA_ETS_STUDENT_INFO_UPDATE_STATUS, {
    data,
  });
};
