/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/models/commonModelState.ts
 * @Description: 描述
 */
import type { CommonModelState } from './commonModel.interface';

const timeList: CheckboxGroupOption[] = [];

for (let i = 0; i < 23; i += 1) {
  timeList.push({
    label: `${i}:00~${i + 1}:00`,
    value: `${i}:00~${i + 1}:00`,
  });
}

const state: CommonModelState = {
  name: 'commonState',
  /**当前管理员信息 */
  userInfo: {},
  currentStationId: 2,
  menuPrower: [],
  isLoading: false,
  /**当前学员信息 */
  studentInfo: {},
  pathname: '',
  /** 个人的菜单 */
  navTree: [],
  /** 所有的菜单权限列表 */
  menuTree: [], //
  /** 历史记录 */
  historyRoute: [],
  /** 按钮权限 */
  permissions: {},
  /** 考试结果（-1：未考试，0：未通过 1：已通过） */
  EXAM_PASS:{
    '-1':'未考试',
    '0':'未通过',
    '1':'已通过',
  },
  /** 所有静态信息 */
  commonStaticInfo: {
    /**试题类型 1:单选题 2:多选题 3:判断题*/
    T_TOPIC_INFO: [],
    /**课程分类  */
    T_COURSE_INFO: [],
    /**培训状态 */
    T_TRAIN_INFO: [],
  },
};

export default state;
