import { HOME_PAGE } from './api';
import { studentHttps } from '@/utils/https';

/**
 *  获取学院端首页信息
 */
export const get_student_home_page = (data: Params) => {
  return studentHttps.get(HOME_PAGE, {
    data,
  });
};
