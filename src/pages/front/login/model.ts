import type { Effect, Reducer, Subscription } from 'umi';
import { ImmerReducer } from 'umi';
import {} from '@/commonServe/index';

export interface LoginModelState {
  name: string;
}

export interface LoginModelType {
  namespace: string;
  state: LoginModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<LoginModelState>;
  };
  subscriptions: { setup: Subscription };
}

const LoginModel: LoginModelType = {
  namespace: 'loginModelState',

  state: {
    name: 'loginMdeol',
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
    setup({ dispatch, history }) {},
  },
};

export default LoginModel;
