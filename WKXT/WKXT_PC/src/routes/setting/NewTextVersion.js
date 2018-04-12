import React from 'react'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Form, Icon, Input, Button, Checkbox, Card, Popconfirm, Table, Select, message} from 'antd';
import {connect} from 'dva'
// import { routerRedux } from 'dva/router';
import {PHASE_OF_STUDY_TYPE} from './constant'

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const getCheckbox = (Type) => {
    let array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, Name}) => {
        array.push(<Checkbox value={ID} key={ID} labelInValue>{Name}</Checkbox>)
    })
    return array
}


//生成新的table名称
const getNewTableItemNames = (array) => {
    if (!(array && array.length)) return {}
    const newTableItemNames = {}
    array.forEach(({ID, Name}) => {
        newTableItemNames[ID] = Name
    })
    const aa = {'1': '高一', '2': '高二', '3': '高三'}
    return {...newTableItemNames,...aa}
}

const getOption = (Type) => {
    const array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, Name}) => {
        array.push(<Select.Option value={ID} key={ID}>{Name}</Select.Option>)
    })
    return array
}

const OtherNameGetOption = (Type) => {
    const array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, OtherName}) => {
        array.push(<Select.Option value={ID} key={ID}>{OtherName}</Select.Option>)
    })
    return array
}



@connect(
    ({loading, common}) => ({
        common,
        submitting: loading.effects['form/SubmitBookConfig'],
    })
)
@Form.create()
export default class NewTextVersion extends React.Component {
    state = {
        list: [],
    }

    componentDidMount() {
        const {phaseID, GID, GIDName} = this.props.location.state
        const {common: {BaseProperList}, dispatch, Publisher = [], Fascicule = [], Modul = [],} = this.props
        if (Publisher.length === 0) dispatch({type: 'common/fetchGetPublisherList'})
        if (Fascicule.length === 0) dispatch({type: 'common/fetchGetFasciculeList', payload: {fasciculeID: 0}})
        if (Modul.length === 0) dispatch({type: 'common/fetchGetGradeListByPhase', payload: {phaseID: '30040'}})
        if (BaseProperList === null) {
            dispatch({type: 'common/fetchGetBaseProperList', payload: {gid: GID}})
        }
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (err) return
            const {GradeList, SubjectList} = values
            this.setState({list: []}, () => {
                this.setState({list: this.getTablelist(GradeList, SubjectList)})
            })
        });
    }

    //生成新的tabellistItem
    getTablelist = (GradeList, SubjectList) => {
        const {phaseID, GID, GIDName} = this.props.location.state
        let {common: {BaseProperList = {}, Publisher = [], Fascicule = [], Modul = [],}} = this.props
        const newList = []
        GradeList.forEach(gradeItem => {
            SubjectList.forEach(SubjectItem => {
                newList.push({
                    key: gradeItem + '_' + SubjectItem,
                    PhaseID: phaseID,
                    PhaseName: PHASE_OF_STUDY_TYPE[phaseID],
                    GradeID: gradeItem,
                    GradeName: this.newGradeListTabelItemName[gradeItem],
                    SubjectID: SubjectItem,
                    SubjectName: this.newSubjectListTabelItemName[SubjectItem],
                    PublisherID: null,
                    // PublisherName: null,
                    FasciculeID: null,
                    // FasciculeName: null,
                    ModulID: null,
                    // ModulName: null,
                })
            })
        })
        return newList
    }

    //delete
    handleDelete = (index) => {
        const list = [...this.state.list].filter((item, thisIndex) => index !== thisIndex)
        this.setState({list})
    }

    handleChange = (index, value, fields) => {
        const list = [...this.state.list]
        list[index][fields] = value
        this.setState({list})
    }

    //提交
    handleClick = () => {
        const {phaseID, GID, GIDName} = this.props.location.state
        const {dispatch} = this.props
        const {list} = this.state
        let canSubmitBoolean = true
        const submitData = list.map(({PhaseID, GradeID, SubjectID, PublisherID, FasciculeID = 0, ModulID = 0}) => {
            if (!(PublisherID && FasciculeID && ModulID)) canSubmitBoolean = false
            const newModulID = ModulID || 0
            const newFasciculeID = FasciculeID || 0
            return {GradeID, SubjectID, PublisherID, FasciculeID: newFasciculeID, ModulID: newModulID}
        })
        // if (!canSubmitBoolean) return message.info('请先完成下拉选项')
        if (submitData.length === 0) return message.info('请至少添加一行')
        dispatch({
            type: 'form/SubmitBookConfig',
            payload: {BookConfigAddItemListModel: submitData, GID, PhaseID: phaseID}
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        let {common: {BaseProperList = {}, Publisher = [], Fascicule = [], Modul = [],}} = this.props
        let phaseID = this.props.location.state.phaseID
        BaseProperList={'30020': {}, '30030': {}, '30040': {},...BaseProperList}
        const {GradeList = [], SubjectList = []} = BaseProperList[phaseID]
        this.newGradeListTabelItemName = getNewTableItemNames(GradeList)
        this.newSubjectListTabelItemName = getNewTableItemNames(SubjectList)
        const formItemLayout = {
            labelCol: {xs: {span: 24}, sm: {span: 8},},
            wrapperCol: {xs: {span: 24}, sm: {span: 16},},
        }
        let columns = [
            {
                title: '年级',
                dataIndex: 'GradeName',
            }, {
                title: '科目',
                dataIndex: 'SubjectName',
            }, {
                title: '教材版本',
                dataIndex: 'PublisherName',
                render: (text, record, index) => <Select style={{width: 250}}
                                                         onChange={(value) => this.handleChange(index, value, 'PublisherID')}
                >
                    {OtherNameGetOption(Publisher)}
                </Select>
            },

        ];
        const FasciculeName = {
            title: '册别',
            dataIndex: 'FasciculeName',
            render: (text, record, index) => <Select style={{width: 250}}
                                                     onChange={(value) => this.handleChange(index, value, 'FasciculeID')}
            >
                {getOption(Fascicule)}
            </Select>
        }
        const ModulName = {
            title: '模块',
            dataIndex: 'ModulName',
            render: (text, record, index) => <Select style={{width: 250}}
                                                     onChange={(value) => this.handleChange(index, value, 'ModulID')}
            >
                {getOption(Modul)}
            </Select>
        }
        columns = phaseID == '30040' ? [...columns, ModulName, FasciculeName,{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return <a href='javascript:void(0);' onClick={() => this.handleDelete(index)}> <Icon type='delete'/></a>

            }
        },] : [...columns, FasciculeName, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return <a href='javascript:void(0);' onClick={() => this.handleDelete(index)}> <Icon type='delete'/></a>

            }
        },]

        return <PageHeaderLayout>
            <Card>
                {BaseProperList !== null && <Form className="login-form">
                    <FormItem
                        label="年级" {...formItemLayout}>
                        {getFieldDecorator('GradeList', {
                            rules: [{required: true, message: '年级必填'}],
                        })(
                            <CheckboxGroup>
                                {getCheckbox(phaseID == '30040' ? [{ID: '1', Name: '高一'}, {
                                    ID: '2',
                                    Name: '高二'
                                }, {ID: '3', Name: '高三'}] : GradeList)}
                            </CheckboxGroup>
                        )}
                    </FormItem>
                    <FormItem
                        label="科目" {...formItemLayout}>
                        {getFieldDecorator('SubjectList', {
                            rules: [{required: true, message: '科目必填'}],
                        })(
                            <CheckboxGroup>
                                {getCheckbox(SubjectList)}
                            </CheckboxGroup>
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{
                            xs: {span: 24, offset: 0},
                            sm: {span: 16, offset: 8},
                        }}
                    >
                        <Button onClick={this.handleSubmit}> 新增</Button>
                        <span style={{padding: '0 10px'}}></span>
                        <Button type="primary" onClick={this.handleClick}>提交</Button>
                    </FormItem>
                </Form>}
                <Table
                    columns={columns}
                    dataSource={this.state.list}
                    pagination={false}
                />
            </Card>
        </PageHeaderLayout>
    }
}




