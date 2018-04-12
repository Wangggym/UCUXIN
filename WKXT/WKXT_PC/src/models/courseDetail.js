import {
    get_basic_course,
    updateResTrySeeByCourse,
    updateResTrySeeByRes,
    updateCoursePackage
} from '../services/supply_api';
import {message} from 'antd'

export default {
    namespace: 'courseDetail',

    state: {
        id: ''
    },

    effects: {
        * fetchBasic({payload}, {call, put}) {
            const response = yield call(get_basic_course, payload);
            yield put({
                type: 'show',
                payload: response
            });
            yield put({type: 'saveId', payload})
        },
        * fetchUpdateResTrySeeByCourse({payload}, {call, put}) {
            const response = yield call(updateResTrySeeByCourse, payload);
            message.success('批量试看成功！');
            const { id } = yield select(state => state.courseDetail);
            yield put({type: 'fetchBasic', payload: id})
        },
        * fetchUpdateResTrySeeByRes({payload}, {call, put,select}) {
            const response = yield call(updateResTrySeeByRes, payload);
            const {isOpenTry} = payload
            const messageInfo = isOpenTry ? '设置试看成功' : '取消试看成功'
            message.success(messageInfo);
            const { id } = yield select(state => state.courseDetail);
            yield put({type: 'fetchBasic', payload: id})
        },
        * putoff({payload}, {call, put, select}) {
            const response = yield call(updateCoursePackage, {
                CoursePackageIDList: payload.CoursePackageIDList,
                IsShelves: payload.IsShelves
            });
            message.success('下架成功');
        },
    },

    reducers: {
        show(state, {payload}) {
            return {
                ...state,
                ...payload,
            };
        },
        saveId(state, {payload}) {
            return {
                ...state, id:payload
            }
        }
    },
};
