/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 13:01:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-28 09:05:58
 * @FilePath: /evdata-exam/src/pages/sys/user/user.interface.ts
 * @Description: 描述
 */
import type { Moment } from 'moment';

export interface UserRoles {
  createBy?: string;
  lastUpdateBy?: string;
  userId?: number;
  roleId: number;
  id: number;
  createById?: number;
  lastUpdateById?: number;
  roleName: string;
}

/**培训信息 */
export interface TrainingInfo {
  sid?: string;
  id?: number;
  //取证日期
  acquireDate: string;
  //证书编号
  certificateNo: string;
  //创建人
  createBy: string;
  //照片url
  picUrl: string;
  //创建时间
  createTime: string;
  //复证日期
  recoverDate: string;
  //备注
  remark: string;
  //培训科目名称
  subjectName: string;
  //照片url数组
  picUrlArr: string[];
}

export interface Item {
  id: number;
  //地址
  address: string;
  // 部门id
  deptId: number;
  // 部门名称
  deptName: string;
  // 入职日期(如:2021-03-05)
  entryDate: string;
  // 职务文本
  jobValue: string;
  // 手机
  mobile: string;
  // 姓名
  useName: string;
  // 签名url
  signUrl: string;
  // 站点名称
  stationSubName: string;
  // 状态文本:0.停用,1.启用
  statusValue: string;
  //证件号码
  idNumber: string;
  // 职务
  job: number;
  // 员工id
  staffId: number;
  // 站点id
  stationId: number;
  /**状态:0.停用,1.启用 */
  status: number;
  //用户角色id集合
  roleIdList: number[];
  /**	账号 */
  account: string;
  //用户角色名称集合
  roleNameList: string[];
  //培训信息列表
  trainingInfoList: TrainingInfo[];
  roleNames: string;
  userRoles: UserRoles[];
  /**密码 */
  password: string
}

export interface Result {
  total: number;
  list: Item[];
}

export interface SearchForm {
  name?: string;
}

export interface ChangeUser extends Omit<Partial<Item>, 'entryDate' | 'status'> {
  roleId: number[];
}

export interface EditTrainingInfo
  extends Omit<Partial<TrainingInfo>, 'recoverDate' | 'acquireDate' | 'picUrl'> {
  acquireDate?: Moment;
  recoverDate?: Moment;
  picUrl?: string[];
}
