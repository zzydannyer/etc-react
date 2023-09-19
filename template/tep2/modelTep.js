const dirName = process.argv[2];
function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(' ');
  return string;
}
const modelTep = `
import type { Effect, Reducer, Subscription } from 'umi';
import { ImmerReducer } from 'umi';
import { } from '@/commonServe/index'

export interface ${titleCase(dirName)}ModelState {
  name: string;
}

export interface ${titleCase(dirName)}ModelType {
  namespace: string;
  state: ${titleCase(dirName)}ModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<${titleCase(dirName)}ModelState>;
  };
  subscriptions: { setup: Subscription };
}

const ${titleCase(dirName)}Model: ${titleCase(dirName)}ModelType = {
  namespace: '${dirName}ModelState',

  state: {
    name: '${dirName}Mdeol',
  },

  effects: {
    *query({ payload }, { call, put }) {

    },
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

    }
  }
};

export default ${titleCase(dirName)}Model;

`;
module.exports = modelTep;
