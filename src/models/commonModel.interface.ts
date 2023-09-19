/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/models/commonModel.interface.ts
 * @Description: 描述
 */
import type {
  Effect,
  Reducer,
  Subscription,
  LoginModelState,
  SysModelState,
  MenuModelState,
} from 'umi';

export interface queryCode {
  itemCname: string;
  itemCode: string;
  queryCode: string;
  seq: string;
}
export interface queryCode_vehicleType {
  itemCname: string;
  itemCode: string;
  queryCode: string;
  parentCode: string;
  seq: string;
}
export interface batchData {
  batchCode: string;
  batchSeq: string;
}

export interface UserInfo {
  loginname?: string;
  orgId?: string;
  roleId?: string;
  roleName?: string;
  updatedTime?: number;
  userId?: string;
  mobile?: string;
  account?: string;
  userName?: string;
}

export interface StudentInfo {
  id?: number;
  /**状态（0：禁用 1：启用） */
  status?: number;
  /**姓名 */
  name?: string;
  /**手机	 */
  mobilePhone?: string;
  /**身份证号	 */
  idCardNo?: string;
  /**入库培训状态（0：未通过 1：已通过） */
  firstTrainStatus?: number;
  /**单位 */
  company?: string;
}

export type Permissions = Record<string, boolean>;

export interface NameID {
  name: string;
  id: number;
}

export interface CommonModelState {
  name: string;
  currentStationId: number;
  userInfo: UserInfo;
  menuPrower: MenuObj[];
  isLoading: boolean;
  pathname: string;
  navTree: NavTree[];
  menuTree: NavTree[];
  historyRoute: HistoryRoute[];
  permissions: Permissions;
  commonStaticInfo: CommonStaticInfo;
  studentInfo: StudentInfo;
  EXAM_PASS: Record<string, string>
}

export interface Effects {
  query: Effect;
  commonDoNotNeedSecurity: Effect;
  getUserInfo: Effect;
  queryMenuPrower: Effect;
  checkLoading: Effect;
  findNavTree: Effect;
  findNenuTree: Effect;
  saveHistoryRoute: Effect;
  findPermissions: Effect;
  getStaticChooseMap: Effect;
  getStudentInfo: Effect;
}

export interface CommonModelType {
  namespace: 'commonState';
  state: CommonModelState;
  effects: Effects;
  reducers: {
    save: Reducer<CommonModelState>;
  };
  subscriptions: { setup: Subscription };
}

export interface CommonState {
  commonState: CommonModelState;
}

/**所有的state */
export interface AllState {
  commonState: CommonModelState;
  menuModelState: MenuModelState;
  sysModelState: SysModelState;
  loginModelState: LoginModelState;
}
