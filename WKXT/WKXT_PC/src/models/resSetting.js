import {
    resSetting_create,
    resSetting_fetch,
    resSetting_watch,
    resSetting_IsEnableResConfig
} from '../services/resSetting';
import {message} from "antd/lib/index";

export default {
    namespace: 'resSetting',

    state: {
        list: [],
        PageSize: null,
        TotalRecords: null,
        PageIndex: null,
        Pages: null,
        gid: 0,
    },

    reducers: {
        save(state, {payload: {ViewModelList: list, PageSize, TotalRecords, PageIndex, Pages}}) {
            return {...state, list, PageSize, TotalRecords, PageIndex, Pages};
        },
    },

    effects: {
        * fetch({payload: {pageIndex = 1, gid = 0, pageSize = 10, type = 1}}, {call, put}) {
            const {Data: {ViewModelList, PageSize, TotalRecords, PageIndex, Pages}} = yield call(resSetting_fetch, {
                pageIndex,
                gid,
                pageSize,
                type
            });
            yield put({
                type: 'save',
                payload: {ViewModelList, PageSize, TotalRecords, PageIndex, Pages},
            });
        },

        * create({payload: {values}}, {call, put, select}) {
            yield call(resSetting_create, values);
            const {pageIndex, gid, pageSize} = yield select(state => state.resSetting);
            yield put({type: 'fetch', payload: {pageIndex, gid, pageSize}});
        },

        * IsEnableResConfig({payload}, {call, put, select}) {
            yield call(resSetting_IsEnableResConfig, payload);
            message.success('启用成功');
            const {pageIndex, gid, pageSize} = yield select(state => state.resSetting);
            yield put({type: 'fetch', payload: {pageIndex, gid, pageSize}});
        },

        // *watch({ payload: { configType = 1, gid } }, { call, put, select }) {
        //   yield call(resSetting_watch, id);
        // },


        // *remove({ payload: id }, { call, put, select }) {
        //   yield call(usersService.remove, id);
        //   const page = yield select(state => state.users.page);
        //   yield put({ type: 'fetch', payload: { page } });
        // },
        // *patch({ payload: { id, values } }, { call, put, select }) {
        //   yield call(usersService.patch, id, values);
        //   const page = yield select(state => state.users.page);
        //   yield put({ type: 'fetch', payload: { page } });
        // },

    },
    // subscriptions: {
    //   setup({ dispatch, history }) {
    //     return history.listen(({ pathname, query }) => {
    //       if (pathname === '/users') {
    //         dispatch({ type: 'fetch', payload: query });
    //       }
    //     });
    //   },
    // },
};