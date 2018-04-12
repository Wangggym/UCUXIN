import {queryNotices} from '../services/api';
import * as api from '../services/common'

export default {
    namespace: 'common',
    state: {
        SupplierList: null, //获得供应商
        phaseOfStudying: [], //获取所以学段
        SubjectListByPhase: [], //获得所有科目列表
        GradeListByPhase: [], //获得所有年级列表

        Publisher: [], //出版社 教材版本
        Fascicule: [], //册别  
        Modul: [],//模块

        BaseProperList: null //获取学段、科目、年级属性集合
    },

    effects: {
        //获得供应商
        * fetchSupplierList({payload}, {put, select, call}) {
            const {Data} = yield call(api.GetSupplierList)
            yield put({type: 'saveSupplierList', payload: Data})
        },

        //获取所以学段
        * fetchPhaseOfStudying({payload: {phaseID, gradeID = 0}}, {put, select, call}) {
            const {Data} = yield call(api.GetPhaseOfStudying, {phaseID, gradeID})
            yield put({type: 'savePhaseOfStudying', payload: {Data, phaseID}})
        },

        //获取所有科目列表
        * fetchSubjectListByPhase({payload: {phaseID, gradeID = 0}}, {put, select, call}) {
            const {Data} = yield call(api.GetSubjectListByPhase, {phaseID, gradeID})
            yield put({type: 'saveSubjectListByPhase', payload: {Data, phaseID}})
        },

        //获取所有年级列表
        * fetchNewGetGradeListByPhase({payload}, {put, select, call}) {
            const {Data} = yield call(api.GetGradeListByPhase, payload)
            yield put({type: 'saveNewGetGradeListByPhase', payload: Data})
        },

        //获得所有出版社 教材版本
        * fetchGetPublisherList({payload}, {put, select, call}) {
            const {Data} = yield call(api.GetPublisherList, payload)
            yield put({type: 'savePublisherList', payload: Data})
        },

        //册别  
        * fetchGetFasciculeList({payload}, {put, select, call}) {
            const {Data} = yield call(api.GetFasciculeList, payload)
            yield put({type: 'saveFasciculeList', payload: Data})
        },

        //模块
        * fetchGetGradeListByPhase({payload}, {put, select, call}) {
            const {Data} = yield call(api.GetGradeListByPhase, payload)
            yield put({type: 'saveGradeListByPhase', payload: Data})
        },

        //获取学段、科目、年级属性集合
        * fetchGetBaseProperList({payload}, {put, select, call}) {
            const {Data} = yield call(api.GetBaseProperList, payload)
            let newData = {}
            Data.forEach((item) => {
                newData[item.PhaseID] = item
            })
            yield put({type: 'saveGetBaseProperList', payload: newData})
        },

    },

    reducers: {
        saveSupplierList(state, {payload}) {
            return {...state, SupplierList: payload}
        },

        savePhaseOfStudying(state, {payload: {Data, phaseID}}) {
            return {...state, phaseOfStudying: [...state.phaseOfStudying, {Data, phaseID}]}
        },
        saveSubjectListByPhase(state, {payload: {Data, phaseID}}) {
            return {...state, SubjectListByPhase: [...state.SubjectListByPhase, {Data, phaseID}]}
        },
        saveNewGetGradeListByPhase(state, {payload: {Data, phaseID}}) {
            return {
                ...state, GetGradeListByPhase: [...state.GetGradeListByPhase, {Data, phaseID}, {
                    '30040': [
                        {ID: '1', Name: '高一'},
                        {ID: '2', Name: '高二'},
                        {ID: '3', Name: '高三'},
                    ]
                }]
            }
        },

        savePublisherList(state, {payload}) {
            return {...state, Publisher: payload}
        },
        saveFasciculeList(state, {payload}) {
            return {...state, Fascicule: payload}
        },
        saveGradeListByPhase(state, {payload}) {
            return {...state, Modul: payload}
        },
        saveGetBaseProperList(state, {payload}) {
            return {...state, BaseProperList: payload}
        }

    },


};
