import React from 'react'
import {Card, Tabs, Button, Table, Pagination, Icon, Popconfirm, Form, Modal, Input, Select} from 'antd'
import styles from './TextVersionManagement.less'
import ResConditionSearch_Text from './ResConditionSearch_Text'
import {connect} from 'dva'
import {PHASE_OF_STUDY_TYPE} from './constant'
import FomModal from './FomModal'
import {routerRedux} from 'dva/router'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

const TabPane = Tabs.TabPane;

@connect(
    ({textVersionManagement, loading, common}) => ({
        common,
        textVersionManagement,
        loading: loading.models.textVersionManagement,
    })
)
export default class TextVersionManagement extends React.Component {
    componentDidMount() {
        const {
            dispatch, common: {Publisher = [], Fascicule = [], Modul = [], BaseProperList = []},
            textVersionManagement: {gid, phaseIDArray, activePhaseID}
        } = this.props
        if (Publisher.length === 0) dispatch({type: 'common/fetchGetPublisherList'})
        if (Fascicule.length === 0) dispatch({type: 'common/fetchGetFasciculeList', payload: {fasciculeID: 0}})
        if (Modul.length === 0) dispatch({type: 'common/fetchGetGradeListByPhase', payload: {phaseID: '30040'}})
        // if (SubjectListByPhase.length === 0) {
        //     dispatch({ type: 'common/fetchSubjectListByPhase', payload: '30020' })
        //     dispatch({ type: 'common/fetchSubjectListByPhase', payload: '30030' })
        //     dispatch({ type: 'common/fetchSubjectListByPhase', payload: '30040' })
        // }
        // if (BaseProperList === null) {
        //     dispatch({type: 'common/fetchGetBaseProperList', payload: {gid: 0}})
        // }
        if (gid && phaseIDArray) {
            dispatch({type: 'textVersionManagement/fetch', payload: {gid, phaseID: activePhaseID}})
        }

    }

    handleSearch = (value) => {
        const {gid: {key: gid, label: gidName}, Phase: phaseIDArray} = value
        const {dispatch} = this.props
        dispatch({
            type: 'textVersionManagement/saveCondition',
            payload: {gid, phaseIDArray, activePhaseID: phaseIDArray[0], gidName}
        })
    }

    handleChangeTabs = (activePhaseID) => {
        const {dispatch} = this.props
        dispatch({
            type: 'textVersionManagement/saveCondition',
            payload: {activePhaseID}
        })
    }

    handleDelete = (bookConfigID) => {
        const {dispatch} = this.props
        dispatch({
            type: 'textVersionManagement/delete',
            payload: {bookConfigID}
        })
    }

    handleModify = (values) => {
        const {dispatch} = this.props
        dispatch({
            type: 'textVersionManagement/modify',
            payload: values
        })
    }

    handleAdd = (activePhaseID) => {
        const {dispatch, textVersionManagement: {gid, gidName}} = this.props
        dispatch(routerRedux.push({
            pathname: '/setting/NewTextVersion',
            state: {phaseID: activePhaseID, GID: gid, GIDName: gidName}
        }))
    }

    render() {
        const {
            textVersionManagement: {list = [], phaseIDArray = [], activePhaseID, gid, gidName},
            loading,
            common: {Publisher = [], Fascicule = [], Modul = []},
        } = this.props
        let defaultValue = null
        if (gid && gidName) {
            defaultValue = {label: gidName, key: gid}
        }

        const columns = (item) => [
            {
                title: '年级',
                dataIndex: 'GradeName',
            }, {
                title: '科目',
                dataIndex: 'SubjectName',
            }, {
                title: '教材版本',
                dataIndex: 'PublisherName',
            },
            {
                title: '模块',
                dataIndex: 'ModulName',
            },
            {
                title: '册别',
                dataIndex: 'FasciculeName',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    const {PublisherID, FasciculeID, ModulID} = record
                    const data = {Publisher, Fascicule, Modul, PublisherID, FasciculeID, ModulID}
                    return <div>
                        <FomModal {...data} modify={(values) => this.handleModify({...record, ...values})}>
                            <a href='javascript:void(0);'> 修改</a>
                        </FomModal>
                        <span style={{padding: '0 10px'}}></span>
                        <Popconfirm title="确定删除么？" onConfirm={() => this.handleDelete(record.ID)}>
                            <a href='javascript:void(0);'> <Icon type='delete'/></a>
                        </Popconfirm>
                    </div>
                }
            },
        ];
        return <PageHeaderLayout>
            <Card>
                <div className={styles.management}>
                    <div className={styles.menu}>
                        <ResConditionSearch_Text onSearch={this.handleSearch} defaultValue={defaultValue}/>
                    </div>
                    <div className={styles.content}>
                        {phaseIDArray && phaseIDArray.length ? <Tabs tabBarExtraContent={<Button type={'primary'}
                                                                                                 onClick={() => this.handleAdd(activePhaseID)}>新增</Button>}
                                                                     onChange={this.handleChangeTabs}
                                                                     activeKey={activePhaseID}>
                            {phaseIDArray && phaseIDArray.length ? phaseIDArray.map((item, index) =>
                                <TabPane tab={PHASE_OF_STUDY_TYPE[item]} key={item}>
                                    <Table
                                        loading={loading}
                                        columns={columns(item)}
                                        dataSource={list}
                                        pagination={false}
                                    />
                                </TabPane>
                            ) : null}
                        </Tabs> : null}
                    </div>
                </div>
            </Card>
        </PageHeaderLayout>
    }
}


