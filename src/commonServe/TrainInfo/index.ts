/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/commonServe/TrainInfo/index.ts
 * @Description: 培训信息
 */

import { https, loadingHttps,arrayBufferHttps } from '@/utils/https';
import * as API from './api';

/**基础分页查询 */
export const post_find_page = (data: Params) => {
  return https.post(API.FIND_PAGE, {
    data,
  });
};

/**新增培训 */
export const post_save = (data: Params) => {
  return https.post(API.SAVE, {
    data,
  });
};

/**修改课程信息 */
export const post_update_course = (data: Params) => {
  return https.post(API.UPDATE_COURSE, {
    data,
  });
};

/**修改考试信息（保存培训或发布培训） */
export const post_update_exam = (data: Params) => {
  return loadingHttps.post(API.UPDATE_EXAM, {
    data,
  });
};

/**查看培训详情 */
export const get_find_by_id = (params: Params) => {
  return https.get(API.FIND_BY_ID, {
    params,
  });
};

/**重发短信 */
export const post_re_send_sms = (data: Params) => {
  return loadingHttps.post(API.RE_SEND_SMS, {
    data,
  });
};

/**查看答题记录 */
export const get_query_exam_answer_detail = (params: Params) => {
  return https.get(API.QUERY_EXAM_ANSWER_DETAIL, {
    params,
  });
};

/**修改基本信息 */
export const post_update_base = (data: Params) => {
  return loadingHttps.post(API.UPDATE_BASE, {
    data,
  });
};

/**发布培训 */
export const post_publish = (params: Params) => {
  return loadingHttps.post(API.PUBLISH, {
    params,
  });
};

/**取消发布 */
export const post_cancel_publish = (data: Params) => {
  return loadingHttps.post(API.CANCEL_PUBLISH, {
    data,
  });
};

/**删除培训 */
export const post_delete = (data: Params) => {
  return loadingHttps.post(API.DELETE, {
    data,
  });
};

/**学员交流信息分页查询 */
export const post_student_message_find_page = (data: Params) => {
  return https.post(API.STUDENT_MESSAGE_FIND_PAGE, {
    data,
  });
};

/**导出学员培训信息 */
export const get_export_student = (id: string) => {
  arrayBufferHttps
    .get(API.EXPORT_STUDENT, {
      params: {
        id,
      },
      responseType:'arrayBuffer'
    })

};
