import type { Moment } from 'moment';

export interface StudentTrainVO {
  /** 单位 */
  company: string;
  /** 结束时间 */
  endTime: string;
  /** 已用考试次数 */
  examTimes: number;
  /** 身份证号 */
  idCardNo: string;
/** 考试结果（-1：未考试，0：未通过 1：已通过） */
  isExamPass: number;
  /** 是否完成学习课程（0：否 1：是） */
  isStudyFinish: number;
  /** 总考试次数 */
  maxExamTimes: number;
  /** 手机 */
  mobilePhone: string;
  /** 成绩 */
  score: number;
  /** 开始时间 */
  startTime: string;
  /** 学员id */
  studentId: number;
  /** 姓名 */
  studentName: string;
  /** 学员培训记录id */
  studentTrainId: number;
  /** 剩余考试次数 */
  surplusExamTimes: number;
  /** 培训名称 */
  trainName: string;
}

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

export interface StuFindPage {
  /** 单位 */
  company: string;
  /** 创建人 */
  createBy: string;
  /** 创建人ID */
  createById: number;
  /** 创建时间 */
  createTime: string;
  /** 是否删除(1：已删除，0：未删除) */
  delFlag: number;
  /** 入库培训状态（0：未通过 1：已通过） */
  firstTrainStatus: number;
  /** 主键id */
  id: number;
  /** 身份证号 */
  idCardNo: string;
  /** 更新人 */
  lastUpdateBy: string;
  /** 更新人id */
  lastUpdateById: number;
  /** 更新时间 */
  lastUpdateTime: string;
  /** 手机 */
  mobilePhone: string;
  /** 姓名 */
  name: string;
  /** 状态（0：禁用 1：启用） */
  status: number;
}

export interface Result {
  total: number;
  list: ItemObj[];
}

export interface ItemObjDetil extends ItemObj {
  detial?: string;
}

export interface AddItem extends Omit<Partial<ItemObj>, 'firstOperationTime'> {
  firstOperationTime: Moment;
}
