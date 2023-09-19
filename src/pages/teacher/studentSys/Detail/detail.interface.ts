/*
 * @Author: 关朝伟
 * @FilePath: /evdata-exam/src/pages/teacher/studentSys/Detail/detail.interface.ts
 * @Description: Detail接口
 */

export interface ItemObj {
  /** 单位*/
  company: string;
  /** 学员id*/
  id: number;
  /** 身份证号*/
  idCardNo: string;
  /** 手机*/
  mobilePhone: string;
  /** 姓名*/
  name: string;
  /** 培训记录 */
  studentTrainVOList: StudentTrainVO[];
}
