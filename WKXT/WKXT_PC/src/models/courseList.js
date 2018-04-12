import {
    updateCoursePackage,
    get_course_list,
    get_Grade,
    get_Subject,
    get_Publish,
    get_supply_list
} from '../services/supply_api';

export default {
    namespace: 'courseList',

    state: {
        list: {},
        gradeList: [],
        subjectList: [],
        publishList: [],
        supplierList: []
    },

    effects: {
        * fetchList({payload}, {call, put}) {
            const response = yield call(get_course_list, payload);
            yield put({
                type: 'queryList',
                payload: response.Data,
            });
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
        * fetchSupply({payload}, {call, put}) {
            const response = yield call(get_supply_list);
            yield put({
                type: 'supplierList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * updateCoursePackage({payload}, {call, put, select}) {
            let obj = yield select(({courseList}) => courseList.list);

            let list = obj.ViewModelList.map(e1 => {
                payload.CoursePackageIDList.forEach(e2 => {
                    if (e1.ID == e2) {
                        e1.IsShelves = payload.IsShelves;
                    }
                })
                return e1;
            })
            const response = yield call(updateCoursePackage, {
                CoursePackageIDList: payload.CoursePackageIDList,
                IsShelves: payload.IsShelves
            });
            yield put({
                type: 'queryList',
                payload: Object.assign({}, obj, {ViewModelList: list}),
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
