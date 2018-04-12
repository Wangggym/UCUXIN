import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {
    Form, Input, DatePicker, Select, Button,
    Card, InputNumber, Radio, Icon, Tooltip, AutoComplete, Checkbox, message,
    Cascader
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
// import { div } from 'gl-matrix/src/gl-matrix/vec4';
import {PHASE_OF_STUDY_TYPE} from './constant'

const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const {TextArea} = Input;

const SupplierGetOption = (Type) => {
    const array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, Name}) => {
        array.push(<Option value={ID} key={ID}>{Name}</Option>)
    })
    return array
}

const getOption = (Type) => {
    const array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, Name}) => {
        array.push(<Option value={ID} key={ID}>{Name}</Option>)
    })
    return array
}

const getCheckbox = (Type) => {
    const array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, Name}) => {
        array.push(<Checkbox value={ID} key={ID}>{Name}</Checkbox>)
    })
    return array
}

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 7},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
    },
};

const submitFormLayout = {
    wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
    },
};

@connect(({loading, common}) => ({
    submitting: loading.effects['form/submitAddResConfig'],
    common,
}))
@Form.create()
export default class AddNewRes extends Component {
    state = {
        TypeValue: '1',
        gid: [],
        customizationPhaseOfStudy: []
    }


    componentDidMount() {
        const {dispatch, common: {SupplierList, phaseOfStudying}} = this.props
        if (SupplierList === null) {
            dispatch({type: 'common/fetchSupplierList'})
        }
        if (phaseOfStudying.length === 0) {
            dispatch({type: 'common/fetchPhaseOfStudying', payload: {phaseID: 30020}})
            dispatch({type: 'common/fetchPhaseOfStudying', payload: {phaseID: 30030}})
            dispatch({type: 'common/fetchPhaseOfStudying', payload: {phaseID: 30040}})
        }
        this.GetRegionList().then(res => {
            this.setState({rid: this.getCascaderOption(res)})
        })
    }

    //当学校选中时
    handleSelect = (value) => {
        const {gid} = this.state
        for (let i = 0; i < gid.length; i++) {
            if (gid[i].ID == value) {
                const customizationPhaseOfStudy = gid[i].Phase
                this.setState({customizationPhaseOfStudy})
            }
        }
    }

    //提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const getNewData = (number) => {
                    const data = {}
                    for (let key in values) {
                        if (key.indexOf(number) !== -1 && values[key] !== undefined) {
                            const newkey = key.slice(number.length)
                            data[newkey] = newkey == 'PhaseID' ? number : values[key]
                        }
                    }
                    if (JSON.stringify(data) !== `{"PhaseID":"${number}"}`) {
                        return data
                    } else {
                        return false
                    }
                }
                const ResPhaseConfigModel = []
                if (getNewData('30020')) ResPhaseConfigModel.push(getNewData('30020'))
                if (getNewData('30030')) ResPhaseConfigModel.push(getNewData('30030'))
                if (getNewData('30040')) ResPhaseConfigModel.push(getNewData('30040'))
                const newResPhaseConfigModel = ResPhaseConfigModel.filter(item => JSON.stringify(item) !== "{}")
                const {gid: GID} = values
                // const payload = GID == undefined ? {
                //     ConfigType: this.state.TypeValue,
                //     ResPhaseConfigModel
                // } : {ConfigType: this.state.TypeValue, ResPhaseConfigModel, GID}
                this.props.dispatch({
                    type: 'form/submitAddResConfig',
                    payload: {ConfigType: this.state.TypeValue, ResPhaseConfigModel: newResPhaseConfigModel, GID},
                });
            }
        });
    }

    //自动搜索
    handleAutoSearch = (name) => {
        clearTimeout(this.timer)
        const {currentRid: rid} = this.state
        this.timer = setTimeout(() => {
            fetch(`https://apitest.ucuxin.com/mcs/v3/ConfigWeb/GetGroupList?keyWord=${name}&rid=${rid}&token=${sessionStorage.getItem('token')}`)
                .then(res => res.json())
                .then(res => {
                    if (res.Ret === 0) {
                        this.setState({gid: res.Data})
                    } else {
                        message.info(res.InfoMsg)
                    }
                })
        }, 500)
    }

    //切换定制
    handleTypeChange = (e) => {

        this.setState({TypeValue: e.target.value}, () => this.props.form.resetFields())
    }

    GetRegionList = (rid) => {
        return fetch(`https://apitest.ucuxin.com/base/v3/Web/GetRegionList?rid=${rid || 0}&token=${sessionStorage.getItem('token')}`)
            .then(res => res.json())
            .then(res => {
                if (!res) return message.error('res为空')
                if (res.Ret === 0) {
                    return res.Data
                } else {
                    message.info(res.Msg)
                }
            })
    }

    handleCascaderChange = (value, selectedOptions) => {
        this.setState({currentRid: value[value.length - 1]})
    }

    handleLoadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        // load options lazily
        this.GetRegionList(targetOption.value).then(res => {
            targetOption.loading = false;
            targetOption.children = this.getCascaderOption(res)
            this.setState({rid: [...this.state.rid]})
        })
    }

    getCascaderOption = (data) => {
        const newData = []
        if (!(data && data.length)) return newData
        data.forEach(({RID, Name, Type}) => {
            newData.push({label: Name, value: RID, isLeaf: Type === 3})
        })
        return newData
    }


    //定制版
    customizationForm() {
        const {submitting, common: {SupplierList = [], phaseOfStudying = []}} = this.props;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const {customizationPhaseOfStudy} = this.state
        return <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{marginTop: 8}}
        >
            <FormItem
                label="机构所属省市县"
                {...formItemLayout}
            >
                {getFieldDecorator('rid', {rules: [{required: true, message: '省市县必填'}]})(
                    <Cascader
                        style={{width: 200}}
                        options={this.state.rid}
                        loadData={this.handleLoadData}
                        onChange={this.handleCascaderChange}
                        changeOnSelect
                        placeholder='请选择省市县'
                    />
                )}
            </FormItem>
            <FormItem label='选择学校'  {...formItemLayout}>
                {getFieldDecorator('gid', {rules: [{required: true, message: '学校必填'}]})(
                    <AutoComplete
                        dataSource={this.state.dataSource}
                        onSearch={this.handleAutoSearch}
                        placeholder="请输入学校信息"
                        onSelect={this.handleSelect}
                    >
                        {getOption(this.state.gid)}
                    </AutoComplete>
                )}

            </FormItem>
            {
                phaseOfStudying && phaseOfStudying.length ? phaseOfStudying.map(({Data, phaseID}, index) =>
                    <Fragment key={index}>
                        {
                            customizationPhaseOfStudy.map(item => {
                                if (item == phaseID) return <FormItem
                                    {...formItemLayout}
                                    label="学段"
                                >
                                    {getFieldDecorator(`${phaseID}PhaseID`)(
                                        <Checkbox value={phaseID}>{PHASE_OF_STUDY_TYPE[phaseID]}</Checkbox>
                                    )}
                                </FormItem>
                            })
                        }
                        {
                            getFieldValue(`${phaseID}PhaseID`) === true && <div>
                                <FormItem   {...formItemLayout} label="供应商">
                                    {getFieldDecorator(`${phaseID}SupplierID`, {
                                        rules: [{required: true, message: '供应商必填'}],
                                    })(
                                        <Select
                                            placeholder="供应商"
                                        >
                                            {SupplierGetOption(SupplierList)}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="科目"
                                >
                                    {getFieldDecorator(`${phaseID}SubjectIDList`, {
                                        rules: [{required: true, message: '科目必填'}],
                                    })(
                                        <CheckboxGroup>
                                            {getCheckbox(Data)}
                                        </CheckboxGroup>
                                    )}
                                </FormItem>
                            </div>}
                    </Fragment>
                ) : null
            }
            <FormItem {...submitFormLayout} style={{marginTop: 32}}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                    提交
                </Button>
            </FormItem>
        </Form>
    }

    //通用版
    commonForm() {
        const {submitting, common: {SupplierList = [], phaseOfStudying = []}} = this.props;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        return <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{marginTop: 8}}
        >
            {
                phaseOfStudying && phaseOfStudying.length ? phaseOfStudying.map(({Data, phaseID}, index) =>
                    <div key={index}>
                        <FormItem
                            {...formItemLayout}
                            label="学段"
                        >
                            {getFieldDecorator(`${phaseID}PhaseID`)(
                                <Checkbox value={phaseID}>{PHASE_OF_STUDY_TYPE[phaseID]}</Checkbox>
                            )}
                        </FormItem>
                        {

                            getFieldValue(`${phaseID}PhaseID`) === true && <div>
                                <FormItem   {...formItemLayout} label="供应商">
                                    {getFieldDecorator(`${phaseID}SupplierID`, {
                                        rules: [{required: true, message: '供应商必填'}],
                                    })(
                                        <Select
                                            placeholder="供应商"
                                        >
                                            {SupplierGetOption(SupplierList)}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="科目"
                                >
                                    {getFieldDecorator(`${phaseID}SubjectIDList`, {
                                        rules: [{required: true, message: '科目必填'}],
                                    })(
                                        <CheckboxGroup>
                                            {getCheckbox(Data)}
                                        </CheckboxGroup>
                                    )}
                                </FormItem>
                            </div>}
                    </div>
                ) : null
            }

            <FormItem {...submitFormLayout} style={{marginTop: 32}}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                    提交
                </Button>
            </FormItem>
        </Form>
    }


    render() {
        const {submitting, common: {SupplierList = []}} = this.props;
        const {getFieldDecorator, getFieldValue} = this.props.form;

        return (
            <PageHeaderLayout>
                <Card bordered={false}>
                    <FormItem {...formItemLayout} label="新增类型">
                        <Radio.Group onChange={this.handleTypeChange} value={this.state.TypeValue}>
                            <Radio value="1">通用版</Radio>
                            <Radio value="2">定制版</Radio>
                        </Radio.Group>
                    </FormItem>
                    {this.state.TypeValue === '2' ? this.customizationForm() : this.commonForm()}
                </Card>
            </PageHeaderLayout>
        );
    }
}
