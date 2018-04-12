import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Badge, Table, Divider, Button, Upload, Icon} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './SupplyDetail.less';

const {Description} = DescriptionList;


const progressColumns = [{
    title: '时间',
    dataIndex: 'time',
    key: 'time',
}, {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (
        text === 'success' ? <Badge status="success" text="成功"/> : <Badge status="processing" text="进行中"/>
    ),
}, {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
}, {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
}];

@connect(({supplyDetail, loading}) => ({
    info: supplyDetail,
    loading: loading.effects['supplyDetail/fetchBasic'],
}))

export default class Detail extends Component {
    componentDidMount() {
        const {dispatch, match} = this.props;
        dispatch({
            type: 'supplyDetail/fetchBasic',
            payload: match.params.id
        });
    }

    //导入
    customRequest = (data) => {
        //加token，配置全局域名
        let url = `http://apitest.ucuxin.com/mcs/v3/CourseManageWeb/ImportSupplierRes?supplierID=${this.props.match.params.id}`;
        var fd = new FormData();
        fd.append('filename', data.file);
        fetch(url, {
            method: 'post',
            body: fd
        }).then(res => {
            if (res.data.Ret == 0) {
                alert('上传成功')
            }
        })
    }
    uploadOnChange = (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            console.log(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            console.log(`${info.file.name} file upload failed.`);
        }
    }


    render() {
        const {info, loading} = this.props;

        const Data = info.Data;
        let goodsData = Data ? Data.BasePropertyList : [];
        if (!(goodsData && goodsData.length)) {
            goodsData = []
        }
        if (goodsData.length) {
            let QtyRes = 0;
            goodsData.forEach((item) => {
                QtyRes += Number(item.QtyRes);
            });
            goodsData = goodsData.concat({
                PhaseName: '总计',
                QtyRes,
            });
        }
        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if (index === goodsData.length) {
                obj.props.colSpan = 0;
            }
            return obj;
        };
        const goodsColumns = [{
            title: '学段',
            dataIndex: 'PhaseName',
            key: 'PhaseName',
            render: (text, row, index) => {
                if (index < goodsData.length) {
                    return text;
                }
                return {
                    children: <span style={{fontWeight: 600}}>总计</span>,
                    props: {
                        colSpan: 4,
                    },
                };
            },
        }, {
            title: '年级',
            dataIndex: 'GradeName',
            key: 'GradeName',
            render: renderContent,
        }, {
            title: '科目',
            dataIndex: 'SubjectName',
            key: 'SubjectName',
            render: renderContent,
        }, {
            title: '教材版本',
            dataIndex: 'PublisherName',
            key: 'PublisherName',
            align: 'right',
            render: renderContent,
        }, {
            title: '数量（个）',
            dataIndex: 'QtyRes',
            key: 'QtyRes',
            align: 'right',
            render: (text, row, index) => {

                if (index < goodsData.length) {
                    return text;
                }
                return <span style={{fontWeight: 600}}>{text}</span>;
            },
        }];
        return (
            <PageHeaderLayout
                title={<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>{Data ? Data.Name : ''}详情页</h2>
                    <Upload name='file'
                            customRequest={this.customRequest}
                            onChange={this.uploadOnChange}
                    >
                        <Button><Icon type="upload"/>导入</Button>
                    </Upload>
                </div>}>
                <Card bordered={false}>
                    <DescriptionList size="large" title="供应商信息" style={{marginBottom: 32}}>
                        <Description term="联系人姓名">{Data ? Data.UName : ''}</Description>
                        <Description term="联系电话">{Data ? Data.Tel : ''}</Description>
                        <Description term="资源总数">{Data ? Data.QtyTotalRes : ''}</Description>
                        <Description term="供应商简介">{Data ? Data.Desc : ''}</Description>
                    </DescriptionList>
                    <Divider style={{marginBottom: 32}}/>
                    <div className={styles.title}>各科目资源</div>
                    <Table
                        style={{marginBottom: 24}}
                        pagination={false}
                        loading={loading}
                        dataSource={goodsData}
                        columns={goodsColumns}
                        rowKey="ID"
                    />

                </Card>
            </PageHeaderLayout>
        );
    }
}
