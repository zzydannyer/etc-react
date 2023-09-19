/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/models/commonModelEffect.ts
 * @Description: 描述
 */
import type { Effects, CommonModelState, CommonState, Permissions } from './commonModel.interface';
import _ from 'lodash';
import {
  getMainMenu,
  get_find_nav_tree,
  get_user_info,
  SysServe,
  get_static_choose_map,
  StudentTrainInfoServe,
} from '@/commonServe/index';
import { transStaticInfo } from '@/utils/util';

const effects: Effects = {
  *query({ payload }, { call, put }) {},

  /**
   * @description: 获取用户信息
   * @param {type}
   * @return {type}
   */
  *getUserInfo({ payload }, { call, put }) {
    const res = yield call(get_user_info, {
      token: window.localStorage.getItem('token'),
    }); // 异步
    if (res.code === 200) {
      yield put({
        // 相当于
        type: 'save',
        payload: {
          userInfo: res.data,
        },
      });
    }
  },
  *checkLoading({ payload }, { call, put }) {
    yield put({
      type: 'save',
      payload: {
        isLoading: payload.data,
      },
    });
  },

  /**
   * @description: 获取用户权限
   * @param {type}
   * @return {type}
   */
  *queryMenuPrower({ payload }, { call, put }) {
    const res = yield call(getMainMenu);

    if (res.code === '0') {
      yield put({
        type: 'save',
        payload: {
          menuPrower: res.data,
        },
      });
    }
  },
  /**
   * @description: 获取用户路由
   * @param {type}
   * @return {type}
   */
  *findNavTree({ payload }, { call, put }) {
    const res = yield call(get_find_nav_tree);

    if (res.code === 200 && res.data && res.data.length > 0) {
      yield put({
        type: 'save',
        payload: {
          navTree: res.data,
        },
      });
    }
  },
  /**
   * @description: 获取用户按钮权限
   * @param {type}
   * @return {type}
   */
  *findPermissions({ payload }, { call, put }) {
    const res = yield call(SysServe.get_find_permissions);

    if (res.code === 200 && res.data && res.data.length > 0) {
      const { data } = res;
      const p: Permissions = {};
      for (let i = 0; i < data.length; i += 1) {
        p[data[i]] = true;
      }
      yield put({
        type: 'save',
        payload: {
          permissions: p,
        },
      });
    }
  },
  /**
   * @description: 获取菜单权限列表
   * @param {type}
   * @return {type}
   */
  *findNenuTree({ payload }, { call, put }) {
    const res = yield call(SysServe.get_find_menu_tree);

    if (res.code === 200) {
      yield put({
        type: 'save',
        payload: {
          menuTree: res.data,
        },
      });
    }
  },
  /**
   * @description: 保存顶部导航信息 暂时没有用
   * @param {type}
   * @return {type}
   */
  *saveHistoryRoute({ payload }, { call, put, select }) {
    const { historyRoute }: CommonModelState = yield select(
      ({ commonState }: CommonState) => commonState,
    );
    if (payload.type === 'add') {
      // 添加
      const hasKey = historyRoute.filter((v) => {
        return v.key === payload.data.key;
      });
      if (hasKey.length === 0) {
        historyRoute.push(payload.data);
        yield put({
          type: 'save',
          payload: {
            historyRoute,
          },
        });
      }
    } else if (payload.type === 'remove') {
      // 删除
      const historyRouteCopy = [...historyRoute];
      _.remove(historyRouteCopy, (n: HistoryRoute) => {
        return payload.data.indexOf(n.key) > -1;
      });
      yield put({
        type: 'save',
        payload: {
          historyRoute: historyRouteCopy,
        },
      });
    } else if (payload.type === 'removeAll') {
      // 删除所有
      yield put({
        type: 'save',
        payload: {
          historyRoute: [],
        },
      });
    }
  },
  /**
   * @description: 获取静态信息
   * @param {*}
   * @return {*}
   */
  *getStaticChooseMap({ payload }, { call, put, select }) {
    const res = yield call(get_static_choose_map);
    if (res.code === 200) {
      yield put({
        type: 'save',
        payload: {
          commonStaticInfo: transStaticInfo(res.data),
        },
      });
    }
  },
  /**
   * @description: 获取学员端的信息
   * @param {*}
   * @return {*}
   */
  *getStudentInfo({ payload }, { call, put, select }) {
    const res = yield call(StudentTrainInfoServe.get_user_info, {});
    if (res.code === 200) {
      yield put({
        type: 'save',
        payload: {
          studentInfo: res.data,
        },
      });
    }
  },
  /**
   * @description: 公共信息 获取
   * @param {type}
   * @return {type}
   */
  *commonDoNotNeedSecurity({ payload }, { call, put, select }) {
    // yield put({ type: 'getCustomerInfoMap', payload: {} });
    // yield put({ type: 'getStaffInfoNameList', payload: {} });
    // yield put({ type: 'getSimpleUserInfoList', payload: {} });
    // yield put({ type: 'getStationNameList', payload: {} });
  },
};

export default effects;
