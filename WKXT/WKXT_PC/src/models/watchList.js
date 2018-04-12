import {
    cancelResTrySee,
    updateCoursePackage,
    get_trySee_list,
    get_Grade,
    get_Subject,
    get_Publish,
    get_supply_list
} from '../services/supply_api';

export default {
    namespace: 'watchList',

    state: {
        list: {},
        gradeList: [],
        subjectList: [],
        publishList: [],
        conditionData: {},
    },

    effects: {
        * fetchList({payload}, {call, put}) {
            const response = yield call(get_trySee_list, payload);
            yield put({type: 'queryList', payload: response.Data,});
            yield put({type: 'saveConditionData', payload})
        },
        * fetchGrade({payload}, {call, put}) {
            const response = yield call(get_Grade, payload);
            console.log(response)
            yield put({
                type: 'gradeList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchSubject({payload}, {call, put}) {
            const response = yield call(get_Subject, {phaseID: payload.phaseID, gradeID: payload.gradeID});
            yield put({
                type: 'subjectList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchPublish({payload}, {call, put}) {
            const response = yield call(get_Publish, {
                phaseID: payload.phaseID,
                gradeID: payload.gradeID,
                subjectID: payload.subjectID
            });
            yield put({
                type: 'publishList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },

        * cancelResTrySee({payload}, {call, put, select}) {
            const response = yield call(cancelResTrySee, {TrySeeIDList: payload.TrySeeIDList});
            const {conditionData} = yield select(state => state.watchList)
            yield put({
                type: 'fetchList',
                payload: conditionData,
            });
        },

    },

    reducers: {
        saveConditionData(state, action) {
            return {
                ...state,
                conditionData: action.payload,
            };
        },
        queryList(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        gradeList(state, action) {
            return {
                ...state,
                gradeList: action.payload
            }
        },
        subjectList(state, action) {
            return {
                ...state,
                subjectList: action.payload
            }
        },
        publishList(state, action) {
            return {
                ...state,
                publishList: action.payload
            }
        },
        supplierList(state, action) {
            return {
                ...state,
                supplierList: action.payload
            }
        },


    },
};
