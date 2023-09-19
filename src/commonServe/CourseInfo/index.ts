/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/commonServe/CourseInfo/index.ts
 * @Description: 课程-章节
 */

import { https, loadingHttps } from '@/utils/https';
import * as API from './api';

/**查询课程下拉框 */
export const get_query_combo_box = () => {
  return https.get(API.QUERY_COMBO_BOX);
};

/**查看课程详情 */
export const get_course_info = (params: Params) => {
  return loadingHttps.get(API.COURSE_INFO, {
    params,
  });
};

/**新增章 */
export const post_save_chapter = (data: Params) => {
  return loadingHttps.post(API.SAVE_CHAPTER, {
    data,
  });
};

/**修改章 */
export const post_update_chapter = (data: Params) => {
  return loadingHttps.post(API.UPDATE_CHAPTER, {
    data,
  });
};

/**删除章 */
export const post_delete_chapter = (params: Params) => {
  return loadingHttps.post(API.DELETE_CHAPTER, {
    params,
  });
};

/**新增小节 */
export const post_save_section = (data: Params) => {
  return loadingHttps.post(API.SAVE_SECTION, {
    data,
  });
};

/**修改小节 */
export const post_update_section = (data: Params) => {
  return loadingHttps.post(API.UPDATE_SECTION, {
    data,
  });
};

/**删除小节 */
export const post_delete_section = (params: Params) => {
  return loadingHttps.post(API.DELETE_SECTION, {
    params,
  });
};

/**上传课件 */
export const post_upload_courseware = (data: Params) => {
  return loadingHttps.post(API.UPLOAD_COURSEWARE, {
    data,
  });
};

/**修改课程信息 */
export const post_update_course = (data: Params) => {
  return loadingHttps.post(API.UPDATE_COURSE, {
    data,
  });
};
