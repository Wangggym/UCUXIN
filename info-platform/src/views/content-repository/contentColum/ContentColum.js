/**
 * Created by Yu Tian Xiong on 2017/12/18.
 * fileName:内容库专栏
 */
import React, { Component } from 'react';
import {Form,Select,Input,message,Button,Table,Modal,Radio,DatePicker} from 'antd';
import Api from '../../../api';
import './ContentColum.less';
import Bottom from '../../publicComponents/listBottom/Bottom';
import PublicFuc from '../../../basics/publicFuc';
import moment from 'moment';

const {TextArea} = Input;
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;

class ContentColum extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataSource: [],//table 数据
            channelList:[],//频道列表
            Keyword:'',//查询关键词
            Status:'',//内容状态
            ChannelID:'',//频道ID
            IsFree:'',//是否免费
            CloudID:'',//区域云ID
            GID:'',//机构ID
            CreateUID:'',//创建人
            sort:'',//排序
            pagination: {current: 1, pageSize: 5},//分页
            loading:false,//table 菊花
            visible:false,//关闭专栏模态
            startVisible:false,//开启专栏模态
            ContentType:'',//内容类型
            ContentID:'',//内容ID
            closeDesc:'',//关闭描述
            data: {type: 0, date: null},//定时发布 立即发布
            sortOne:'1',//预览排序
            sortTwo:'1',//收藏排序
            sortThree:'1',
            sortFour:'1',
            sortFive:'1',
            promotionVisible:false,
        };
        this.columns = [
          {
            title: '列表',
            dataIndex: 'cake',
            width:180,
            render:(text,record)=>(
              <div className="thumb-img">
                <img src={PublicFuc.handleContent(record.Status)} alt="" className="status-img"/>
                <img src={record.Thumb} className="item-img"/>
              </div>
            )
          },
            {
                title: '列表',
                dataIndex: 'List',
                render: (text, record) => (
                    <div className="list-item">
                        {/*左侧封面图*/}

                        {/*右侧细节*/}
                        <div className="content">
                            {/*标题 操作按钮*/}
                            <div style={{marginLeft:6}}>
                                <span className="content-title">{record.Title}</span>
                                <span className="content-qtyItems">【共{record.QtyItems}集】</span>
                                <span className="button-right">
                                    {record.Status === 8 && <Button className="operation-btn" onClick={()=>this.getPriceStrategy(record.ID)}>促销更新</Button>}
                                    <Button className="operation-btn" onClick={()=>this.getSmallColum(record.ID,record.Title)}>小集详情</Button>
                                    {record.Status ===5 ? <Button className="operation-btn" onClick={()=>this.nowPublishScolumn(record.ID)}>立即发布</Button>:null}
                                    {record.Status ===0 || record.Status ===5 || record.Status === 9 || record.Status === 8? <Button className="operation-btn" onClick={()=>this.goEditScolumn(record.ID)}>编辑</Button> :null}
                                    {record.Status ===9 ? <Button className="operation-btn" onClick={()=>this.handleStartScolumn(record.ContentType,record.ID)}>开启</Button>:null}
                                    {record.Status ===5 || record.Status === 8 ? <Button className="operation-btn" onClick={()=>this.handleCloseScolumn(record.ID)}>关闭</Button>:null}
                                    {record.Status ===0 || record.Status ===9 ? <Button className="operation-btn" onClick={()=>this.handleDeleteScolumn(record.ID)}>删除</Button>:null}
                                </span>
                            </div>
                            {/*发布人 发布时间 等*/}
                            <div className="item-info">
                                <span className="item-one">所在频道：{record.ChannelsName}</span>
                                {record.PublishUName && <span className="item-one">发布人：{record.PublishUName}</span>}
                                {record.PublishDate && <span className="item-one">发布时间：{record.PublishDate}</span>}
                                {record.PublishTimerDate && <span className="item-one">定时发布时间：{record.PublishTimerDate}</span>}
                                {record.CloseUName && <span className="item-one">关闭人：{record.CloseUName}</span>}
                                {record.CloseDate && <span className="item-one">关闭时间：{record.CloseDate}</span>}
                                <span className="item-coin">
                                    <span className="coin-item">售价:<span className="item-color">￥{record.SalePrice}</span></span>
                                    <span className="coin-item">购买:<span className="item-color">{record.OrderCount}人</span></span>
                                    <span className="coin-item">收入:<span className="item-color">￥{record.OrderAmount}</span></span>
                                </span>
                            </div>
                            {/*摘要*/}
                            {record.Summary !== null ? <div className="item-info item-info-one">{PublicFuc.changeString(record.Summary)}</div> : <div className="item-info-one"></div>}
                            {/*更新方式  预览  收藏 分享*/}
                            <div className="item-info">
                                <span>更新方式：&nbsp;{record.UpdateDesc}</span>
                                <span  className="one-left">已更新到：&nbsp;第{record.LastestItemNo}集</span>
                                <span  className="one-left"><span className="link-color" onClick={()=>this.goUpdate(record.NextItemID,record.ID,record.Title)}>更新第{record.NextItemNo}集</span></span>
                                <span  className="item-two">
                                    <span className="one-left"><img src={require('../../../assets/images/see.png')} alt="" style={{position: 'relative', top: '1px'}}/>&nbsp;&nbsp;<span className="middle-p">预览&nbsp;{record.ReadCount}</span></span>
                                <span className="one-left"><img src={require('../../../assets/images/favorite.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">收藏&nbsp;{record.FavoriteCount}</span></span>
                                <span className="one-left"><img src={require('../../../assets/images/zhuan.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">分享&nbsp;{record.ShareCount}</span></span>
                                </span>
                            </div>
                            {record.CloseDesc && record.Status === 9 ? <div className="item-info" style={{color: '#cf331c'}}>关闭原因:{record.CloseDesc}</div> : null}

                        </div>
                    </div>
                )
            }
        ];
        this.colum = [
          {
            title: '状态',
            dataIndex: 'StatusName',
            width: 50,

          },
        {
          title: '期数',
          dataIndex: 'SNO',
          width: 50,

        },
        {
          title: '促销说明',
          dataIndex: 'Desc',
          width: 50,
          render: (text, record, index) => (
            (
              <div>
                {record.Desc && <span>{this.handleTitle(record.Desc)}</span>}
              </div>
            )
          )
        },
        {
          title: '促销价格',
          dataIndex: 'SalePrice',
          width: 50,
        },
        {
          title: '购买人数',
          dataIndex: 'OrderCount',
          width: 50,
        },
        {
          title: '收入',
          dataIndex: 'OrderAmount',
          width: 50,
        },
          {
            title: '促销时间段',
            dataIndex: 'Date',
            width: 50,
            render: (text, record, index) => (
              (
                <div className="btn-group">
                  <span>{record.BeginDate}</span>~
                  <span>{record.EndDate}</span>
                </div>
              )
            )
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 50,
            render: (text, record, index) => (
              (
                <div className="btn-group">
                  {record.Status === 1 && <a onClick={()=>this.closePriceStrategy(record.ID)}>关闭</a>}
                </div>
              )
            )
          }
      ]

    }
    componentDidMount() {
        this.getchannelList();
        this.getScolumnList(1)
    }
    //获取频道列表
    getchannelList = () => {
        Api.Info.getChannelList().then(res => {
            if (res.Ret === 0) {
                this.setState({channelList: res.Data})
            } else {
                message.error(res.Msg);
            }
        })
    };
    //获取专栏列表
    getScolumnList= (pIndex,cake) =>{
        const {Keyword,Status,ChannelID,IsFree,CloudID,GID,CreateUID,sort} = this.state;
        const {current, pageSize} = this.state.pagination;
        this.setState({loading: true});
        Api.Content.getScolumnList({
            pageIndex: pIndex || current,
            pageSize: pageSize,
            body: {Keyword,Status,ChannelID,IsFree,CloudID,GID,CreateUID,SortFields:sort}
        }).then(res=>{
            if(res.Ret===0){
                let dataSource = [];
                const pagination = cake || {...this.state.pagination};
                if (res.Data) {
                    pagination.total = res.Data.TotalRecords;
                    pagination.current = res.Data.PageIndex;
                    if (res.Data.TotalRecords) {
                        let data = res.Data.ViewModelList;
                        //操作关联内容数据
                        data.map(item => {
                            dataSource.push({
                                ...item,
                            })
                        })
                    }
                }
                this.setState({dataSource, pagination, loading: false});

            }else {
                message.error(res.Msg);
            }
        })
    };
    //操作分页
    handleTableChange = (pagination)=> {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({pagination: pager});
        this.getScolumnList(pagination.current);
    };
    /*-----------------关闭专栏-------------------*/
    handleCloseScolumn = (id) =>{
        //在关闭按钮上打开模态
        this.setState({visible:true,ContentID:id})
    };
    //获取文本域的值
    onChangeCloseDesc = (e) =>{
        this.setState({closeDesc: e.target.value});
    };
    //关闭模态并调用关闭专栏接口
    handleOk = () =>{
        const {ContentID, closeDesc, pagination} = this.state;
        if (closeDesc === "") {
            message.warning('请输入关闭原因');
        } else {
            Api.Content.handleCloseScolumn({contentID: ContentID, closeDesc: closeDesc}).then(res => {
                if (res.Ret === 0) {
                    this.setState({visible: false, ContentType: '', closeDesc: '',}, () => {
                        this.getScolumnList(pagination.current)});
                    message.success('关闭成功');
                } else {message.error(res.Msg)}
            });
        }
    };
    //取消 modal
    handleCancel = () => {
        this.setState({visible:false})
    };
    /*-----------------开启专栏-------------------*/
    //打开开启专栏模态并赋值
    handleStartScolumn = (type, id) => {
        this.setState({startVisible: true, ContentType: type, ContentID: id});
    };
    //操作即时发布单选按钮  datePicker
    handleChangeType = (e) => {
        const data = {...this.state.data, type: +e.target.value, date: null};
        this.setState({data});
    };
    handleChangeDate = (value) => {
        const data = {...this.state.data, date: value};
        this.setState({data});
    };
    //关闭开启专栏模态并调用开启接口
    handleConfirm = () =>{
        //publishSendType:1 定时发布   publishSendType:0 即时发布
        const {pagination, data, ContentType, ContentID} = this.state;
        if (data.type === 1 && data.date === null) {message.info('请选择定时发布时间');return;}
        Api.Content.handleStartScolumn({
            contentType: ContentType,
            contentID: ContentID,
            publishSendType: data.type,
            publishTimerDate: data.type === 0 ? '' : moment(data.date).format('YYYY-MM-DD HH:mm:ss'),//定时发布时间
        }).then(res => {
            if (res.Ret === 0) {
                this.setState({startVisible: false, ContentType: ''}, () => {this.getScolumnList(pagination.current);});
                message.success('开启资讯成功');
            } else {
                message.error(res.Msg);
            }
        });
    };
    //取消开启专栏模态
    handleStartCancel = () => this.setState({startVisible:false});
    /*-----------------删除专栏-------------------*/
    handleDeleteScolumn = (id) =>{
        let _this = this;
        confirm({
            title: '是否确定删除该专栏?',
            onOk() {
                Api.Content.handleDeleteScolumn({contentID: id}).then(res => {
                    if (res.Ret === 0) {
                        _this.getScolumnList(1);
                        message.success('删除资讯成功');
                    } else {
                        message.error(res.Msg);
                    }
                })
            },
            onCancel() {},
        });
    };
    /*-----------------编辑专栏-------------------*/
  goEditScolumn = (id) => this.props.history.push(`/contents/scolumn/editscolumn/${id}`);
    //跳转专栏小集
  getSmallColum = (id,title) => {
    sessionStorage.setItem('key',id);
    sessionStorage.setItem('title',title);
    this.props.history.push({pathname: '/contents/scolumn/smallscolumn'})
  };
  //更新小集 跳转编辑小集页
  goUpdate = (id,ID,title) => {
    sessionStorage.setItem('key',ID);
    sessionStorage.setItem('title',title);
    this.props.history.push(`/contents/scolumn/smallscolumn/edit/${id}`);
  };

  /*-----------------立即发布专栏-------------------*/
    nowPublishScolumn = (id) =>{
      let _this = this;
      confirm({
        title: '确定立即发布该资讯吗?',
        onOk() {
          Api.Content.nowPublishScolumn({contentID: id}).then(res => {
            if (res.Ret === 0) {
              _this.getScolumnList(1);
              message.success('发布资讯成功');
            } else {
              message.error(res.Msg);
            }
          })
        },
        onCancel() {},
      });
    };

    /*下拉选项框操作*/
    //频道
    handleSelectChannel = (value) => {
        const {pagination} = this.state;
        this.setState({ChannelID: value, SortFields: ''}, () => {this.getScolumnList(pagination.current);})
    };
    //状态
    handleSelectContentType = (value) => {
        this.setState({
            Status: value,
            SortFields: '',
            ContentType: '',
        }, () => {this.getScolumnList(1);})
    };
    //是否收费
    handleSelectIsRefContent = (value) => {
        const {pagination} = this.state;
        this.setState({
            IsFree: value,
            SortFields: ''
        }, () => {this.getScolumnList(pagination.current);})
    };


    /*排序*/
    //预览
    handleReadCount = () =>{
        let {pagination, sortOne} = this.state;
        if (sortOne === "1") {
            this.setState({
                sortOne: "-1",
                sort: [{Field: 'ReadCount', sortType: "-1",}]
            }, () => {
                this.getScolumnList(pagination.current);
            })
        } else if (sortOne === "-1") {
            this.setState({
                sortOne: "1",
                sort: [{Field: 'ReadCount', sortType: "1",}]
            }, () => {
                this.getScolumnList(pagination.current);
            })
        }
    };
    //收藏
    handleFavoriteCount = () => {
        let {pagination, sortTwo} = this.state;
        if (sortTwo === "1") {
            this.setState({
                sortTwo: "-1",
                sort: [{Field: 'FavoriteCount', sortType: "-1",}]
            }, () => {
                this.getScolumnList(pagination.current);
            })
        } else if (sortTwo === "-1") {
            this.setState({
                sortTwo: "1",
                sort: [{Field: 'FavoriteCount', sortType: "1",}]
            }, () => {
                this.getScolumnList(pagination.current);
            })
        }
    };
    //分享
    handleShareCount = () =>{
        let {pagination, sortThree} = this.state;
        if (sortThree === "1") {
            this.setState({
                sortThree: "-1",
                sort: [{Field: 'ShareCount', sortType: "-1",}]
            }, () => {
                this.getScolumnList(pagination.current);
            })
        } else if (sortThree === "-1") {
            this.setState({
                sortThree: "1",
                sort: [{Field: 'ShareCount', sortType: "1",}]
            }, () => {
                this.getScolumnList(pagination.current);
            })
        }
    };
    //购买人数
    handlePreOrderCount = () =>{
    let {pagination, sortFour} = this.state;
    if (sortFour === "1") {
      this.setState({
        sortFour: "-1",
        sort: [{Field: 'OrderCount', sortType: "-1",}]
      }, () => {
        this.getScolumnList(pagination.current);
      })
    } else if (sortFour === "-1") {
      this.setState({
        sortFour: "1",
        sort: [{Field: 'OrderCount', sortType: "1",}]
      }, () => {
        this.getScolumnList(pagination.current);
      })
    }
  };
    //收入
    handlePreOrderAmount = () =>{
    let {pagination, sortFive} = this.state;
    if (sortFive === "1") {
      this.setState({
        sortFive: "-1",
        sort: [{Field: 'OrderAmount', sortType: "-1",}]
      }, () => {
        this.getScolumnList(pagination.current);
      })
    } else if (sortFive === "-1") {
      this.setState({
        sortFive: "1",
        sort: [{Field: 'OrderAmount', sortType: "1",}]
      }, () => {
        this.getScolumnList(pagination.current);
      })
    }
  };

    //默认
    handleDefault = () =>{
    this.setState({
      sortType: '1',//排序
      sortOne: '1',
      sortTwo: '1',
      sortThree: '1',
      sortFour:'1',
      sortFive:'1',
      Keyword:'',//查询关键词
      Status:'',//内容状态
      ChannelID:'',//频道ID
      IsFree:'',//是否免费
      CloudID:'',//区域云ID
      GID:'',//机构ID
      CreateUID:'',//创建人
      sort:'',//排序
      pagination: {current: 1, pageSize: 5},//分页
      loading:false,//table 菊花
      visible:false,//关闭专栏模态
      startVisible:false,//开启专栏模态
      ContentType:'',//内容类型
      ContentID:'',//内容ID
      closeDesc:'',//关闭描述
    },()=>{this.getScolumnList(1);})
  };

    //促销更新
    handleCancelUpdate = () =>this.setState({promotionVisible:false});

    //保存价格策略
    savePriceStrategy = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let beginDate = values.time && values.time.length !== 0 && moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss") || "";
      let endDate = values.time && values.time.length !== 0 && moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss") || "";
      if (!err) {
        let body = {
          ID:this.state.ID ? this.state.ID : '',
          Status:'',
          StatusName:'',
          ContentID:this.state.promotionID,
          ContentType:21,
          BeginDate:beginDate,
          EndDate:endDate,
          SalePrice:values.price,
          Desc:values.instruction,
          SNO:'',
          OrderCount:'',
          OrderAmount:''
        };
        Api.Content.savePriceStrategy({body}).then(res=>{
          if(res.Ret===0){
            let { setFieldsValue } = this.props.form;
            setFieldsValue({time:'',price:'',instruction:''});
            this.setState({ID:res.Data.ID});
            this.getPriceStrategy(this.state.promotionID);
            message.success('保存价格策略成功');
          }
        });
      }
    });
  };

    //获取价格策略
    getPriceStrategy = (id) =>{
      this.setState({promotionVisible:true,promotionID:id});
      Api.Content.getPriceStrategy({contentType:21,contentID:id}).then(res=>{
        if(res.Ret===0){
          let dataAll = [];
          let priceAll = 0;//求总价
          let data = res.Data;
          data.map(item=>{
            priceAll += item.OrderAmount;
            dataAll.push({
              ...item,
            })
          });
          this.setState({dataAll,priceAll})

        }
      })
    };



    //关闭价格策略
    closePriceStrategy = (id) =>{
      Api.Content.closePriceStrategy({ID:id}).then(res=>{
        if(res.Ret===0){
          this.getPriceStrategy(this.state.promotionID);
          message.info('关闭价格策略成功');
        }
      })
    };
    //底部切换
    swicthPageSize = (cake) => {
      const pager = {...this.state.pagination};
      pager.pageSize = cake.pageSize;
      this.setState({pagination:pager,loading:true},()=>this.getScolumnList(1))
    };

    //处理促销说明
    handleTitle = (title) => {
      let Title = title.substr(0);
      if (Title.length > 20) {
        Title = `${Title.substr(0, 20)}...`
      }
      return Title;
    };

    render() {
        const {channelList,dataSource,pagination,loading,closeDesc,data,sortOne,sortTwo,sortThree,sortFour,sortFive} = this.state;
        const iconOne = sortOne === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        const iconTwo = sortTwo === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        const iconThree = sortThree === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        const iconFour = sortFour === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        const iconFive = sortFive === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 6},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 14},
        },
      };
        const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 14,
            offset: 6,
          },
        },
      };
        return (
            <div className="Colum">
                {/* 关闭资讯 */}
                <Modal
                    title="关闭专栏"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <TextArea placeholder="请输入关闭原因" autosize={{minRows: 6, maxRows: 10}}
                              onChange={this.onChangeCloseDesc} value={closeDesc}/>
                </Modal>
                {/* 开启资讯 */}
                <Modal
                    title="开启专栏"
                    visible={this.state.startVisible}
                    onOk={this.handleConfirm}
                    onCancel={this.handleStartCancel}
                >
                    <div className="publish-set">
                        <RadioGroup defaultValue={data.type.toString()} onChange={this.handleChangeType}>
                            <Radio value="0">即时发布</Radio>
                            <Radio value="1">定时发布</Radio>
                        </RadioGroup>
                        {
                            data.type == 1 && <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                onChange={this.handleChangeDate}
                            />
                        }
                    </div>
                </Modal>
                {/*促销更新*/}
                <Modal
                  title="促销更新"
                  visible={this.state.promotionVisible}
                  onCancel={this.handleCancelUpdate}
                  maskClosable = {false}
                  wrapClassName="vertical-center-modal"
                  width={1000}
                  footer={null}
                >
                  <Form>
                    <FormItem {...formItemLayout} label="促销时间">
                      {getFieldDecorator('time', {
                        rules: [{ required: true, message: '请确认促销时间' }],
                      })(
                        <RangePicker format="YYYY-MM-DD HH:mm:ss" style={{width:'80%'}} showTime={{format: 'HH:mm:ss'}}/>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="促销说明">
                      {getFieldDecorator('instruction', {
                        rules: [{ required: false, message: '请确认促销说明' }],
                      })(
                        <TextArea autosize={{minRows: 1, maxRows: 10}} style={{width:'80%'}} maxLength="30" placeholder="促销说明不超过30个字"/>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="促销价格">
                      {getFieldDecorator('price', {
                        rules: [{ required: true, message: '请确认促销价格' }],
                      })(
                        <Input type="number" style={{width:'80%'}}/>
                      )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                      <Button onClick={(e)=>this.savePriceStrategy(e)} type="primary">确定</Button>
                    </FormItem>
                    <Table
                      rowKey="ID"
                      bordered
                      columns={this.colum}
                      dataSource={this.state.dataAll}
                      pagination={false}
                      size="small"
                      footer={()=> <a>促销总收入： <span style={{color:'#c10d10'}}>￥{this.state.priceAll}元</span></a>}
                    />
                  </Form>

                </Modal>
                <div className="colum-search">
                    <Search
                        placeholder="搜索"
                        onSearch={value => {
                            this.setState({Keyword: value, SortFields: ''}, () => {
                                this.getScolumnList(pagination.current);
                            });
                        }}
                        className="search-value"
                    />
                </div>
                {/*下拉选项框*/}
              <Form layout="inline">
              <FormItem label="频道">
                <Select defaultValue="全部" style={{width: 120}} onSelect={this.handleSelectChannel}>
                  <Option value={""}>全部</Option>
                  {Array.isArray(channelList) && channelList.map(item => <Option value={item.ID}
                                                                                 key={item.ID}>{item.Name}</Option>)}
                </Select>
              </FormItem>
              <FormItem label="状态">
                <Select defaultValue="全部" style={{width: 120}} onChange={this.handleSelectContentType}>
                  <Option value={""}>全部</Option>
                  <Option value={"0"}>草稿</Option>
                  <Option value={"1"}>审核中</Option>
                  <Option value={"2"}>不通过</Option>
                  {/*<Option value={"3"}>编辑发布</Option>*/}
                  <Option value={"5"}>定时发布</Option>
                  <Option value={"8"}>已发布</Option>
                  <Option value={"9"}>已关闭</Option>
                  <Option value={"11"}>已结束</Option>
                </Select>
              </FormItem>
              <FormItem label="是否收费">
                <Select defaultValue="全部" style={{width: 120}} onChange={this.handleSelectIsRefContent}>
                  <Option value={""}>全部</Option>
                  <Option value={"false"}>是</Option>
                  <Option value={"true"}>否</Option>
                </Select>
              </FormItem>
            </Form>
                {/*点击排序*/}
                <div className="sort">
                    <span style={{position: 'relative', bottom: '2px'}}>排序:</span>
                    <span className="sort-item" onClick={this.handleDefault}>默认</span>
                    <span className="sort-item" onClick={this.handleReadCount}>预览数{iconOne}</span>
                    <span className="sort-item" onClick={this.handleFavoriteCount}>收藏数{iconTwo}</span>
                    <span className="sort-item" onClick={this.handleShareCount}>分享数{iconThree}</span>
                    <span className="sort-item" onClick={this.handlePreOrderCount}>购买人数{iconFour}</span>
                    <span className="sort-item" onClick={this.handlePreOrderAmount}>收入{iconFive}</span>
                    <Button onClick={()=>{this.props.history.push('/contents/scolumn/editscolumn/')}} className="sort-btn" size="large">新增专栏</Button>
                </div>
                {/*列表*/}
                <div className="list-table">
                    <Table
                        rowClassName={() => 'no-bordered'}
                        rowKey="ID"
                        columns={this.columns}
                        showHeader={false}
                        loading={loading}
                        bordered={true}
                        dataSource={dataSource}
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange}
                    />
                </div>
                <Bottom pagination={pagination} refreshList={(cake)=>{this.swicthPageSize(cake)}}/>
            </div>
        )
    }
}

export default Form.create()(ContentColum);