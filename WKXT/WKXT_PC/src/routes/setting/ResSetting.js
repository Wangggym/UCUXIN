import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import {
    Pagination,
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider,
    Table
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ResSetting.less';
import ResConditionSearch from './ResConditionSearch'
import Details from './Details'

const FormItem = Form.Item;
const {Option} = Select;



@connect(
    ({resSetting, loading}) => ({
        resSetting,
        loading: loading.models.resSetting,
    })
)
export default class ResSetting extends PureComponent {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({type: 'resSetting/fetch', payload: {pageIndex: 1}});
    }

    handlepageChange = (pageIndex) => {
        const {dispatch} = this.props;
        dispatch({type: 'resSetting/fetch', payload: {pageIndex}});
    }

    handleSearch = ({gid,type}) => {
        const {dispatch} = this.props;
        dispatch({type: 'resSetting/fetch', payload: {gid,type}});
    }

    handleAddNew = () => {
        const {dispatch} = this.props;
        dispatch(routerRedux.push('/setting/addNewRes'));
    }

    handleStartUsing = ({ConfigType, PhaseID, SupplierID, ResCategoryID, GID}) => {
        const {dispatch} = this.props;
        dispatch({type: 'resSetting/IsEnableResConfig',
            payload: {
                configType: ConfigType,
                phaseID: PhaseID,
                supplierID: SupplierID,
                resCategoryID: ResCategoryID,
                gid: GID
            }
        })
    }

    render() {
        const {loading, resSetting: {list, TotalRecords, PageIndex, PageSize}} = this.props;
        const columns = [
            {
                title: '配置类型',
                dataIndex: 'ConfigTypeName',
            },
            {
                title: '学校名称',
                dataIndex: 'GName',
            },
            {
                title: '学段',
                dataIndex: 'PhaseName',
            },
            {
                title: '科目',
                dataIndex: 'SubjectNameList',
                render: (text, {SubjectNameList = []}) => {
                    return <div>{SubjectNameList.map(item => <span style={{paddingRight: 10}}>{item}</span>)}</div>
                }
            },
            {
                title: '供应商名称',
                dataIndex: 'SupplierName',
            },
            {
                title: '分类名称',
                dataIndex: 'ResCategoryName',
            },
            {
                title: '是否启用',
                dataIndex: 'IsEnable',
                render: (text, record) => text ? <span style={{color: '#ccc'}}>已启用</span> :
                    <a href='javascript:void(0);' onClick={() => this.handleStartUsing(record)}>启用</a>
            },

        ];
        return (
            <PageHeaderLayout>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.flexForm}>
                            <ResConditionSearch onSearch={this.handleSearch}/>
                            <Button icon="plus" type="primary" onClick={this.handleAddNew}>
                                新建
                            </Button>
                        </div>
                        <Table
                            loading={loading}
                            columns={columns}
                            dataSource={list}
                            pagination={false}
                        />
                        <Pagination
                            className="ant-table-pagination"
                            total={TotalRecords}
                            current={PageIndex}
                            pageSize={PageSize}
                            onChange={this.handlepageChange}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}






