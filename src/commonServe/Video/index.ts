/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/commonServe/Video/index.ts
 * @Description: 视频相关接口
 */

import { videoHttps, https } from '@/utils/https';

import {
  VOD_INFO_SAVE,
  CREATE_UPLOAD_VIDEO,
  GET_PLAY_INFO,
  GET_VIDEO_PLAY_AUTH,
  REFRESH_UPLOAD_VIDEO,
  VOD_INFO_FIND_PAGE,
} from './api';

/**保存视频信息 */
export const post_upload_video_save = (data: Params) => {
  return https.post(VOD_INFO_SAVE, {
    data,
  });
};

/**
 * 获取上传地址
 * @param data
 * @returns
 */
export const post_create_upload_video = (data: Params) => {
  return https.post(CREATE_UPLOAD_VIDEO, {
    data,
  });
};

/**
 * 刷新视频上传凭证
 * @param data
 * @returns
 */
export const get_refresh_upload_video = (params: Params) => {
  return https.get(REFRESH_UPLOAD_VIDEO, {
    params,
  });
};

/**
 * 基础分页查询
 * @param data
 * @returns
 */
export const post_vod_info_find_page = (data: Params) => {
  return https.post(VOD_INFO_FIND_PAGE, {
    data,
  });
};

/**
 * 获取视频播放凭证
 * @param data
 * @returns
 */
export const get_video_play_auth = (params: Params) => {
  return https.get(GET_VIDEO_PLAY_AUTH, {
    params,
  });
};

/**
 * 获取视频播放地址
 * @param data
 * @returns
 */
export const get_play_info = (params: Params) => {
  return https.get(GET_PLAY_INFO, {
    params,
  });
};
