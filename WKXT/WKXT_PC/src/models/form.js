import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {fakeSubmitForm} from '../services/api';

import * as api from '../services/form'

export default {
    namespace: 'form',

    state: {
        step: {
            payAccount: 'ant-design@alipay.com',
            receiverAccount: 'test@example.com',
            receiverName: 'Alex',
            amount: '500',
        },
        SupplierModel: []
    },

    effects: {
        * submitRegularForm({payload}, {call}) {
            yield call(fakeSubmitForm, payload);

            message.success('提交成功');
        },
        * submitStepForm({payload}, {call, put}) {
            yield call(fakeSubmitForm, payload);
            yield put({
                type: 'saveStepFormData',
                payload,
            });
            yield put(routerRedux.push('/form/step-form/result'));
        },
        * submitAdvancedForm({payload}, {call}) {
            yield call(fakeSubmitForm, payload);
            message.success('提交成功');
        },

        * submitAddResConfig({payload}, {call, put}) {
            const result = yield call(api.submitForm_addResConfig, payload);
            if (result) {
                if (result.Ret) {
                    message.error(result.Msg);
                } else {
                    yield put(routerRedux.push('/setting/res-setting'));
                    message.success('提交成功');
                }
            } else {
                message.error('网络出小差了, 请稍后再试');
            }
        },

        //批量新增学校教材版本
        * SubmitBookConfig({payload}, {call, put}) {
            const result= yield call(api.SubmitBookConfig, payload);
            if (result) {
                if (result.Ret) {
                    message.error(result.Msg);
                } else {
                    yield put(routerRedux.push('/setting/textVersionManagement'));
                    message.success('提交成功');
                }
            } else {
                message.error('网络出小差了, 请稍后再试');
            }
        },


    },

    reducers: {
        saveSupplierModel(state, {payload}) {
            return {
                ...state,
                step: {
                    ...state.step,
                    ...payload,
                },
            };
        },
    },
};
