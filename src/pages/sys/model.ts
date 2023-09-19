import type { Effect, Reducer, Subscription } from 'umi';
import { ImmerReducer } from 'umi';
import {} from '@/commonServe/index';

export interface SysModelState {
  name: string;
}

export interface SysModelType {
  namespace: string;
  state: SysModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<SysModelState>;
  };
  subscriptions: { setup: Subscription };
}

const SysModel: SysModelType = {
  namespace: 'sysModelState',

  state: {
    name: 'sysMdeol',
  },

  effects: {
    *query({ payload }, { call, put }) {},
  },
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
      // return history.listen(({ pathname }) => {
      //   if (pathname === '/') {
      //     dispatch({
      //       type: 'query',
      //     })
      //   }
      // });
    },
  },
};

export default SysModel;
