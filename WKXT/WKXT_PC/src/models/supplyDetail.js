import { get_basic_supply} from '../services/supply_api';

export default {
  namespace: 'supplyDetail',

  state: {
   
    basicGoods: [],
    
  },

  effects: {

    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(get_basic_supply,payload);
      console.log(response)
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
