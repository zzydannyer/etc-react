/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/commonServe/TopicInfo/index.ts
 * @Description: 题目信息
 */
import { https, loadingHttps } from '@/utils/https';
import * as API from './api';

/**基础分页查询 */
export const post_find_page = (data: Params) => {
  return https.post(API.FIND_PAGE, {
    data,
  });
};

/**基础分页查询 */
export const post_save = (data: Params) => {
  return https.post(API.SAVE, {
    data,
  });
};

/**查看题目详情 */
export const get_find_by_id = (params: Params) => {
  return https.get(API.FIND_BY_ID, {
    params,
  });
};

/**修改题目 */
export const post_update = (data: Params) => {
  return loadingHttps.post(API.UPDATE, {
    data,
  });
};

/**删除题目 */
export const post_delete = (data: Params) => {
  return loadingHttps.post(API.DELETE, {
    data,
  });
};

/**下载excel导入模板 */
export const get_download = () => {
  return https.post(API.DOWNLOAD, {});
};
