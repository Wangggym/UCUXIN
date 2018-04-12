/**
 *  Create by xj on 2018/1/8.
 *  fileName: index
 */
import React, {Component} from 'react';
import {Form, message, Select, DatePicker, Input, Row, Table, Button} from 'antd';
import Api from '../../api';
import moment from 'moment';
import Bottom from '../publicComponents/listBottom/Bottom';
import ReactDOM from 'react-dom';
import "./order.less"

const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;


const dateFormat = 'YYYY-MM-DD';

class Column extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	x:1050,
            pagination: {pageSize: 10, current: 1},
            dataSource: {},
            IsDiscount: "",//是否促销
            Status: 2,    //订单状态
            SortFields: [],//排序
            OrderMinDate: "",//查询开始时间
            OrderMaxDate: "",//查询结束时间
            ContentName: "",//专栏名称
            ContentType:21
        };
     }
        getColumns(x){
        	

        		return  [
		            {
		                title: '订单状态',
		                dataIndex: 'StatusName',
		                width: 100,
		
		            },
		            {
		                title: '订单号',
		                dataIndex: 'OrderNo',
		                width: 150,
		            },
		            {
		                title: '订阅日期',
		                dataIndex: 'OrderDate',
		                width: 100,
		                sorter: true,
		            },
		            {
		                title: '订阅人',
		                dataIndex: 'OrderUName',
		                width: 100,
		            },
		            {
		                title: '订阅人账号',
		                dataIndex: 'OrderUAccount',
		                width: 80,
		
		
		            },
		            {
		                title: '内容名称',
		                dataIndex: 'ContentName',
		                width: 200,
						className:"hiddenTxt"
		            },
		            {
		                title: '售出价格',
		                dataIndex: 'SalePrice',
		                width: 100,
		
		            },
		            {
		                title: '是否促销',
		                dataIndex: 'IsDiscount',
		                width: 100,
		
		            },
		            {
		                title: '付款日期',
		                dataIndex: 'PayDate',
		                width: x-930,
		
		            },
		        ]
        }
    componentDidMount() {
    	var width=ReactDOM.findDOMNode(this.lv).clientWidth
    	this.setState({x:width-48})
        this.getPageData()
        //获取页面高度
        this.handleResize();
        
        window.addEventListener('resize',()=>this.handleResize())
    }
    //重设屏幕高度
    handleResize=()=>{
        let clientHeight= document.documentElement.clientHeight;
        let scorollHeight= clientHeight- 390;//445=顶部高度+底部高度
        this.setState({
            scorollHeight:scorollHeight
        })
    };
    //获取订单列表
    getPageData() {
        this.setState({loading: true});
        const {pagination, IsDiscount, Status, SortFields, OrderMinDate, OrderMaxDate, ContentName,ContentType} = this.state;
        let getDataConfig = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
            body: {
                Status: Status,
                ContentName: ContentName,
                IsDiscount: IsDiscount,
                SortFields: SortFields,
                OrderMinDate: OrderMinDate,
                OrderMaxDate: OrderMaxDate,
                ContentType:this.props.ContentType||ContentType
            }
        };
        let NewViewModelList = [];
        //获取列表
        Api.order.GetOrderContentList(getDataConfig).then(res => {
            if (res.Ret === 0) {
                if (res.Data) {
                    const pagination = {...this.state.pagination};
                    pagination.total = res.Data.TotalRecords;
                    pagination.current = res.Data.PageIndex;
                    //处理数据
                    res.Data.ViewModelList.forEach(item => {
                        let obj = {
                            ID: item.ID,
                            Status: item.Status,
                            StatusName: item.StatusName,
                            OrderNo: item.OrderNo,
                            OrderDate: item.OrderDate,
                            OrderUID: item.OrderUID,
                            OrderUName: item.OrderUName,
                            OrderUAccount: item.OrderUAccount,
                            ContentType: item.ContentType,
                            ContentID: item.ContentID,
                            ContentName: <a className='content-name content-name2'>{item.ContentName}</a>,
                            SalePrice: item.SalePrice,
                            IsDiscount: item.IsDiscount ? "是" : "否",
                            IsFree: item.IsFree,
                            PayDate: item.PayDate,
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
                message.error(res.Msg);
            }
        })
        //获取统计
        Api.order.GetOrderContentSum(getDataConfig).then(res=>{
            if(res.Ret===0){
                this.setState({SalePrice_Sum:res.Data.SalePrice_Sum})
            }else {
                message.error(res.Msg)
            }
        })
    }
	
    //查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let OrderMinDate = values.searchByDate && values.searchByDate.length !== 0 && moment(values.searchByDate[0]).format(dateFormat) || "";
            let OrderMaxDate = values.searchByDate && values.searchByDate.length !== 0 && moment(values.searchByDate[1]).format(dateFormat) || "";
            this.setState({
                Status: values.Status,
                ContentName: values.ContentName,
                IsDiscount: values.IsDiscount,
                OrderMinDate: OrderMinDate,
                OrderMaxDate: OrderMaxDate,
                pagination: Object.assign({}, this.state.pagination, {
                    current: 1
                })
            }, () => this.getPageData())
        })
    }

    //改变时触发
    onChangePage(pagination, filters, sorter) {
        let SortFields = [];
        //排序改变
        if(sorter.field){
            let obj = {
                Field: sorter.field,
                SortType: sorter.order === "descend" ? -1 : 1
            };
            SortFields = [obj];
        }

        //页码改变
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({pagination: pager, loading: true, SortFields}, () => this.getPageData());
    }

    //切换底部默认请求条数
    swicthPageSize = (cake) => {
        const pager = {...this.state.pagination};
        pager.pageSize = cake.pageSize;
        this.setState({pagination:pager,loading:true},()=>this.getPageData())
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const {SalePrice_Sum,x}=this.state;
		console.log(x)
        return (
            <div className="commont-tabel" ref={el => this.lv = el}>
                <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
                    <Row>
                        <FormItem label={'订单状态'}>
                            {getFieldDecorator(`Status`, {initialValue: "2"})(
                                <Select
                                    style={{width: 100}}
                                    optionFilterProp="children"
                                    onChange={() => {
                                    }}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="" key={0}>全部</Option>                               
                                    <Option value="1" key={3}>待付款</Option>
                                    <Option value="2" key={4}>已完成</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem label={'是否促销'}>
                            {getFieldDecorator(`IsDiscount`, {initialValue: ""})(
                                <Select
                                    style={{width: 100}}
                                    optionFilterProp="children"
                                    onChange={() => {
                                    }}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="" key={0}>全部</Option>
                                    <Option value="true" key={1}>是</Option>
                                    <Option value="false" key={2}>否</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem label="订阅日期">
                            {getFieldDecorator(`searchByDate`, {initialValue: ""})(<RangePicker format={dateFormat}/>)}
                        </FormItem>
                        
                        <FormItem label="内容">
                            {getFieldDecorator(`ContentName`, {initialValue: ""})(<Input placeholder="请输入内容名称"/>)}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
                        </FormItem>
                    </Row>


                    <Table rowKey="ID" bordered columns={this.getColumns(x)}
                           style={{marginTop: "0.5rem"}}
                           loading={this.state.loading}
                           pagination={this.state.pagination}
                           dataSource={this.state.dataSource.ViewModelList}
                           onChange={(pagination, filters, sorter) => {
                               this.onChangePage(pagination, filters, sorter)
                           }}
                           footer={()=> <a>总收入 <span>{SalePrice_Sum}</span>元</a>}
                           scroll={{x: x, y: this.state.scorollHeight}}
                        //total={this.state.data.TotalRecords}
                        //showTotal={total => `共 ${total} 条`}
                        //showQuickJumper={this.state.data.Pages > 10}
                        // rowSelection={rowSelection}
                    />
                    <Bottom pagination={this.state.pagination} refreshList={(cake) => {
                        this.swicthPageSize(cake)
                    }}/>

                </Form>

            </div>
        )
    }
}

export default Form.create()(Column)