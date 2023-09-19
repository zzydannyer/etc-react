import type { Effect, Reducer, Subscription } from 'umi';
import { ImmerReducer } from 'umi';
import {} from '@/commonServe/index';

export interface MenuModelState {
  name: string;
}

export interface MenuModelType {
  namespace: string;
  state: MenuModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<MenuModelState>;
  };
  subscriptions: { setup: Subscription };
}

const MenuModel: MenuModelType = {
  namespace: 'menuModelState',

  state: {
    name: 'menuMdeol',
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

export default MenuModel;
