/*
 * @Author: cmf
 * @Date: 2020-09-04 16:14:48
 * @LastEditTime: 2021-08-17 16:35:23
 * @LastEditors: Please set LastEditors
 * @Description: 公共model存
 * @FilePath: \evdata-exam\src\models\commonModel.ts
 */
import type { Effect, Reducer, Subscription } from 'umi';
import commonState from './commonModelState';
import commonEffects from './commonModelEffect';
import type { CommonModelType, AllState } from './commonModel.interface';
import { ImmerReducer } from 'umi';
import { Location } from 'history';

const commonModel: CommonModelType = {
  namespace: 'commonState',
  state: commonState,
  effects: commonEffects,
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname !== '/') {
          //  console.log(pathname);
          // dispatch({
          //   type: 'saveHistoryRoute',
          //   payload: {
          //     data:history.location
          //   },
          // });
        }
      });
    },
  },
};

export const selectAll = (state: AllState) => {
  return state;
};

export default commonModel;
