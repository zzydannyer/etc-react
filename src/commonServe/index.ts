/*
 * @Author: cmf
 * @Date: 2020-09-03 21:43:14
 * @LastEditTime: 2021-09-22 15:17:11
 * @LastEditors: Please set LastEditors
 * @Description: 公共请求地址
 * @FilePath: /evdata-exam/src/commonServe/index.ts
 */
import qs from 'qs';
import { https, loadingHttps } from '@/utils/https';
import {
  GET_MAIN_MENU,
  GET_USER_INFO,
  FIND_NAV_TREE,
  LOGIN,
  LOGOUT,
  GET_STATIC_CHOOSE_MAP,
  GET_ACCESS_TOKEN,
  GET_STUDENT_TOKEN,
  GET_TEMP_URL,
  LOGOUT_YWTB,
} from './api';
import * as HomePage from './HomePage';
import * as Sys from './Sys';
import * as Role from './role';
import * as Video from './Video';
import * as TrainInfo from './TrainInfo';
import * as TopicInfo from './TopicInfo';
import * as StudentInfo from './StudentInfo';
import * as StudentHomePage from './StudentHomePage';
import * as StudentTrainInfo from './StudentTrainInfo';
import * as CourseInfo from './CourseInfo';
import * as ExamPaperInfo from './ExamPaperInfo';
/**
 * @description: 角色接口
 * @param {type}
 * @return {type}
 */
export const RoleServe = Role;

/**
 * @description: 系统管理接口
 * @param {type}
 * @return {type}
 */
export const SysServe = Sys;

export const HomePageServe = HomePage;

/**培训信息 */
export const TrainInfoServe = TrainInfo;

/**题目信息 */
export const TopicInfoServe = TopicInfo;

/**视频相关 */

export const VideoServe = Video;

/**试卷相关 */
export const ExamPaperInfoServe = ExamPaperInfo;

/**课程 章节 小节 视频 */
export const CourseInfoServe = CourseInfo;

/**
 * @description: 学员信息
 * @param {*}
 * @return {*}
 */
export const StudentInfoServe = StudentInfo;
/**
 * 学员端首页信息
 */
export const StuHomePage = StudentHomePage;
/**学员端培训信息 */
export const StudentTrainInfoServe = StudentTrainInfo;
// 登录
export const post_login = (data: Params) => {
  return https.post(`${LOGIN}`, {
    data,
  });
};

/**
 * @description: 退出
 * @param {type}
 * @return {type}
 */
export const post_logout = () => {
  return https.get(`${LOGOUT}`, {});
};

// 全局api接口
export const get_user_info = (query: Params) => {
  return https.get(`${GET_USER_INFO}`, {});
};

// 全局api接口
export const getMainMenu = () => {
  return https.get(GET_MAIN_MENU, {
    params: { timestamp: 1 },
  });
};

// 权限路由
export const get_find_nav_tree = (query: Params) => {
  return https.get(`${FIND_NAV_TREE}?userName=${window.localStorage.getItem('userName')}`);
};

/**
 * @description: 静态信息
 * @param {number} id
 * @return {*}
 */
export const get_static_choose_map = () => {
  return https.get(GET_STATIC_CHOOSE_MAP, {});
};

/**
 * @description: 一网通登录
 * @param {number}
 * @return {*}
 */
export const get_access_token = () => {
  return loadingHttps.get(GET_ACCESS_TOKEN, {});
};

/**
 * @description: 一网通-获取学生真的token
 * @param {number}
 * @return {*}
 */
export const get_student_token = (params: Params) => {
  return loadingHttps.get(GET_STUDENT_TOKEN, { params });
};

/**
 * @description: 获取oss文件下载地址
 * @param {Params} params
 * @return {*}
 */
export const get_temp_url = (params: Params) => {
  return loadingHttps.get(GET_TEMP_URL, { params });
};

export const get_logout_ywtb = (params: Params) => {
  return loadingHttps.get(LOGOUT_YWTB, { params });
};
