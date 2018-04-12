import { get_supply_list} from '../services/supply_api';

export default {
  namespace: 'supplyList',

  state: {
    list: [],

  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(get_supply_list);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.Data) ? response.Data : [],
      });
    },
  

  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
 
  
  },
};
