import {
  MY_TRAIN_LIST,
  EXAM_SCORE,
  TRAIN_DETAIL,
  STUDENT_MESSAGE_FIND_PAGE,
  SEND_STUDENT_MESSAGE,
  EXAM_PAPER_DETAIL,
  SUBMIT_EXAM_ANSWER,
  GET_VIDEO_PLAYAUTH,
  GET_PLAY_INFO,
  GET_USER_INFO,
  UPDATE_STUDY_PROGRESS,
  GET_TEMPURL,
  LOGOUT,
  QUERY_QUESTION_LIST,
} from './api';
import { studentHttps, studentLoadingHttps } from '@/utils/https';

/**
 *  获取学员培训列表信息
 */
export const my_train_list = (data: Params) => {
  return studentLoadingHttps.post(`${MY_TRAIN_LIST}`, {
    data,
  });
};
/**
 * 查看成绩
 */
export const exam_score = (data: Params) => {
  return studentHttps.get(EXAM_SCORE, {
    params: data,
  });
};
/**
 * 培训详情
 */
export const train_detail = (data: Params) => {
  return studentHttps.get(TRAIN_DETAIL, {
    params: data,
  });
};
/**
 * 学员交流信息
 */
export const student_message_find_page = (data: Params) => {
  return studentHttps.post(`${STUDENT_MESSAGE_FIND_PAGE}`, {
    data,
  });
};
/**
 * 提交学员交流信息
 */
export const send_student_message = (data: Params) => {
  return studentHttps.post(`${SEND_STUDENT_MESSAGE}`, {
    data,
  });
};
/**
 * 查询考试试卷详情
 */
export const exam_paper_detail = (data: Params) => {
  return studentHttps.get(EXAM_PAPER_DETAIL, {
    params: data,
  });
};
/**
 * 提交试卷答案
 */
export const submit_exam_answer = (data: Params) => {
  return studentLoadingHttps.post(`${SUBMIT_EXAM_ANSWER}`, {
    data,
  });
};
/**
 * 获取视频播放凭证
 */
export const get_video_playauth = (data: Params) => {
  return studentHttps.get(GET_VIDEO_PLAYAUTH, {
    params: data,
  });
};
/**
 * 获取视频播放地址
 */
export const get_play_info = (data: Params) => {
  return studentHttps.get(GET_PLAY_INFO, {
    params: data,
  });
};
/**
 * 获取用户信息
 */
export const get_user_info = (data: Params) => {
  return studentHttps.get(GET_USER_INFO, {
    params: data,
  });
};
/**
 * 更新小节学习进度
 */
export const update_study_progress = (data: Params) => {
  return studentHttps.post(`${UPDATE_STUDY_PROGRESS}`, {
    data,
  });
};
/**获取oss文件下载地址 */
export const get_tempurl = (data: Params) => {
  return studentLoadingHttps.get(GET_TEMPURL, {
    params: data,
  });
};

/**注销 */
export const get_logout = () => {
  return studentHttps.get(LOGOUT);
};

/**
 * 查询培训常见问题列表
 */
export const get_query_question_list = (data: Params) => {
  return studentHttps.post(`${QUERY_QUESTION_LIST}`, {
    data,
  });
};
