/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/commonServe/ExamPaperInfo/index.ts
 * @Description: 试卷
 */
import { https, loadingHttps } from '@/utils/https';

import * as API from './api';

/**查询试卷下拉框 */
export const get_query_combo_box = () => {
  return https.get(API.QUERY_COMBO_BOX);
};

/**查看试卷详情 */
export const get_find_by_id = (params: Params) => {
  return https.get(API.FIND_BY_ID, {
    params,
  });
};

/**新增大题 */
export const post_save_subject = (data: Params) => {
  return loadingHttps.post(API.SAVE_SUBJECT, {
    data,
  });
};

/**修改大题 */
export const post_update_subject = (data: Params) => {
  return loadingHttps.post(API.UPDATE_SUBJECT, {
    data,
  });
};

/**删除大题 */
export const post_delete_subject = (params: Params) => {
  return loadingHttps.post(API.DELETE_SUBJECT, {
    params,
  });
};

/**新增大题选择题目 */
export const post_save_subject_topic = (data: Params) => {
  return loadingHttps.post(API.SAVE_SUBJECT_TOPIC, {
    data,
  });
};

/**修改题目分数 */
export const post_updateTopicScore = (data: Params) => {
  return loadingHttps.post(API.UPDATE_TOPIC_SCORE, {
    data,
  });
};

/**删除大题选择题目 */
export const post_deleteSubjectTopic = (params: Params) => {
  return loadingHttps.post(API.DELETE_SUBJECT_TOPIC, {
    params,
  });
};

/**修改试卷名称 */
export const post_updateExamPaper = (data: Params) => {
  return loadingHttps.post(API.UPDATE_EXAM_PAPER, {
    data,
  });
};
