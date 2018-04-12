import {query as queryUsers, queryCurrent} from '../services/user';

export default {
    namespace: 'user',

    state: {
        list: [],
        currentUser: {},
    },

    effects: {
        // * fetch(_, {call, put}) {
        //     const response = yield call(queryUsers);
        //     yield put({
        //         type: 'save',
        //         payload: response,
        //     });
        // },
        * fetchCurrent(_, {call, put}) {
            const {Data: {UName: name, Pic: avatar}} = yield call(queryCurrent);
            yield put({
                type: 'saveCurrentUser',
                payload: {name, avatar},
            });


        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        saveCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload,
            };
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload,
                },
            };
        },
    },
};
