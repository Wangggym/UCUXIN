/**
 * Created by Yu Tian Xiong on 2017/12/18.
 * fileName:机构管理
 */
import React, {Component} from 'react';
import {Form, message, Select, Input,Table, Modal, Button ,TreeSelect } from 'antd';
import Directory from '../publicComponents/directory/Directory';
import MenuRules from '../publicComponents/menuRules/menuRules';
import oss from '../../basics/oss';

import Api from '../../api';
import './Organization.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const confirm = Modal.confirm;

class Organization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {pageSize: 10, current: 1},
            dataSource: {},
            SortFields: [],//排序字段
            roleList: [],//角色列表
        };
        this.columns = [
            {
                title: '状态',
                dataIndex: 'StatusName',
                width: 50,
            },
            {
                title: '头像',
                dataIndex: 'Photo',
                width: 70,

            },
            {
                title: '姓名',
                dataIndex: 'Name',
                width: 70,

            },
            {
                title: '身份',
                dataIndex: 'RoleName',
                width: 70,

            },
            {
                title: '手机号',
                dataIndex: 'Tel',
                width: 50,

            },
            {
                title: '发布资讯数',
                dataIndex: 'NewsCount',
                sorter: true,
                width: 75,

            },
            {
                title: '发布专栏数',
                dataIndex: 'ScolumnsCount',
                sorter: true,
                width: 75,

            },
            {
                title: '创造收入',
                dataIndex: 'AmountSum',
                sorter: true,
                width: 50,
            },
            {
                title:"操作",
                dataIndex:"operation",
                width:80,
                render: (text, record, index) => (
                    (
                        <div className="btn-group">
                            <a  onClick={()=>this.goEditMember(record.ID)}>编辑</a>
                            {
                                record.Status===0&&<a onClick={()=>this.setStatus(record)}>启用</a>
                            }
                            {
                                record.Status===1&&<a  onClick={()=>this.setStatus(record)}>停用</a>
                            }
                            <a onClick={()=>this.DelMember(record.ID)}>删除</a>
                        </div>
                    )
                )
            }
        ]
    };


    componentDidMount() {
        //获取角色列表
        this.getRoleList();
        //获取机构成员清单
        this.getPageData();

    }

    //获取角色列表
    getRoleList = () => {
        Api.OrgManger.GetOrderContentList().then(res => {
            if (res.Ret === 0) {
                this.setState({roleList: res.Data})
            } else {
                message.error(res.Msg)
            }
        })
    };
    //获取机构成员清单
    getPageData = () => {
        const {pagination, SortFields, Status,RoleID,Name} = this.state;
        this.setState({loading: true});
        let getDataConfig = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
            body: {
                Status: Status || "",
                RoleID: RoleID||"",
                Name: Name||"",
                SortFields: SortFields,
            }
        };
        let NewViewModelList = [];
        Api.OrgManger.GetList(getDataConfig).then(res => {
            if (res.Ret === 0) {
                if (res.Data) {
                    // console.log(res.Data);
                    const pagination = {...this.state.pagination};
                    pagination.total = res.Data.TotalRecords;
                    pagination.current = res.Data.PageIndex;
                    //处理数据
                    res.Data.ViewModelList.forEach(item => {
                        let obj = {
                            ID: item.ID,
                            Status: item.Status,
                            StatusName: item.StatusName,
                            UID: item.UID,
                            Tel: item.Tel,
                            Name: item.Name,
                            Photo: <div className="logo"><img src={item.Photo}/></div>,
                            RoleID: item.RoleID,
                            RoleName: item.RoleName,
                            NewsCount: item.NewsCount,
                            //ContentName: <a className='content-name'>{item.ContentName}</a>,
                            ScolumnsCount: item.ScolumnsCount,
                            AmountSum: item.AmountSum,
                        };
                        NewViewModelList.push(obj)
                    });
                    this.setState({
                        dataSource: Object.assign({}, this.state.dataSource, {
                            ViewModelList: NewViewModelList
                        }),
                        pagination,
                        loading: false
                    })
                } else {
                    setTimeout(() => this.setState({loading: false}), 10000)
                }
            } else {
                message.error(res.Msg)
            }
        })
    };
    //查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.setState({
                Status: values.Status,
                RoleID:values.role,
                Name:values.name,
                pagination: Object.assign({}, this.state.pagination, {
                    current: 1
                })
            }, () => this.getPageData())
        })
    };
    //删除成员
    DelMember = (id) => {
        let _this = this;
        confirm({
            title: '是否确定删除?',
            onOk() {
                Api.OrgManger.DelMember({ID: id}).then(res => {
                    if (res.Ret === 0) {
                        _this.getPageData();
                        message.success('删除成功');
                    } else {
                        message.error(res.Msg);
                    }
                })
            },
            onCancel() {},
        });
    };
    //设置成员状态
    setStatus = (e) => {
        let _this = this;
        let getDataConfig = {
            ID : e.ID,
            status : e.Status === 1 ? 0 : 1,
        };
        Api.OrgManger.SetStatus(getDataConfig).then(res => {
            if(res.Ret === 0) {
                _this.getPageData();
                e.Status === 1 ? message.success('停用成功') : message.success('启用成功');
            }else {
                message.error(res.Msg);
            }
        })
    };
    //跳转编辑成员
    goEditMember = (id) =>{
        this.props.history.push(`/org/editMember/${id}`);
    };



    //改变时触发
    onChangePage(pagination, filters, sorter) {
        //排序改变
        const {SortFields} = this.state;
        let arr = [];
        let a = [];
        if (sorter.field) {
            let obj = {
                Field: sorter.field,
                SortType: sorter.order === "descend" ? -1 : 1
            };
            if (SortFields.length === 0) {
                arr.push(obj)
            } else {
                a = SortFields.filter(e => e.Field !== obj.Field); //筛选出来没有的数组
                a.push(obj);
                arr = a;
            }
        }
        //页码改变
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({pagination: pager, loading: true, SortFields: arr}, () => this.getPageData());
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };
    handleSelectChange = (value) => {
        this.props.form.setFieldsValue({
            note: `Hi, ${value === '1' ? 'man' : 'lady'}!`,
        });
    };
    onChange = (value) => {
        console.log('onChange ', value, arguments);
        this.setState({ value });
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const {roleList,visible,cover,uploadPicLoading,treeData} = this.state;
        return (
            <div className="organization-manager">



                <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
                    <FormItem label={"状态"}>
                        {getFieldDecorator(`Status`, {initialValue: ""})(
                            <Select
                                style={{width: 150}}
                                optionFilterProp="children"
                                onChange={() => {
                                }}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="" key={0}>全部</Option>
                                <Option value="0" key={1}>无效</Option>
                                <Option value="1" key={2}>正常</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={"角色"}>
                        {
                            getFieldDecorator('role', {initialValue: ""})(
                                <Select
                                    style={{width: 150}}
                                    optionFilterProp="children"
                                    onChange={() => {
                                    }}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="" key="0">全部</Option>
                                    {
                                        roleList.map(item => {
                                            return (
                                                <Option value={(item.ID).toString()} key={item.ID}>{item.Name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label={"姓名"}>
                        {
                            getFieldDecorator('name', {initialValue: ""})(
                                <Input placeholder="请输入姓名"/>
                            )
                        }
                    </FormItem>

                    <FormItem>
                        <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" style={{marginLeft: 8}} icon="plus" onClick={() => {
                            this.props.history.push('/org/editMember')
                        }} >新增</Button>
                    </FormItem>

                    <Table rowKey="ID" bordered columns={this.columns}
                           style={{marginTop: "0.5rem"}}
                           loading={this.state.loading}
                           pagination={this.state.pagination}
                           dataSource={this.state.dataSource.ViewModelList}
                           onChange={(pagination, filters, sorter) => {
                               this.onChangePage(pagination, filters, sorter)
                           }}

                        //scroll={{x: 1500, y: this.state.scorollHeight}}
                    />
                </Form>
            </div>
        )
    }
}

export default Form.create()(Organization);