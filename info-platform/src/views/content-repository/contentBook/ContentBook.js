/**
 * Created by Yu Tian Xiong on 2017/12/18.
 * fileName:内容库电子书
 */
import React, {Component} from 'react';
import {Form, Input, Select, Button, Table,message,Modal,DatePicker} from 'antd';
import Bottom from '../../publicComponents/listBottom/Bottom';
import PublicFuc from '../../../basics/publicFuc';
import moment from 'moment';
import './contentBook.less';
import Api from '../../../api';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const {TextArea} = Input;
const confirm = Modal.confirm;

class ContentBook extends Component {
  constructor(props){
    super(props);
    this.state = {
      pagination: {current: 1, pageSize: 5},//分页
      Keyword: '',//机构类型
      Status: '',//内容状态
      ChareType: '',//是否免费
      CloudID: '',//区域云ID
      GID: '',//机构
      CreateUID: '',//创建人
      SortFields: '',//排序字段
      closeDesc:'',//描述
      sortOne:'1',
      sortTwo:'1',
      sortThree:'1',
      sortFour:'1',//预览数
      sortFive:'1',//购买人数
      sortSix:'1',//收入
      sort:''
    };
    this.columns = [
      {
        title: '列表',
        dataIndex: 'cake',
        width:100,
        render:(text,record)=>(
          <div className="thumb-img">
            <img src={PublicFuc.handleBook(record.Status)} alt="" className="status-img"/>
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
            {/*标题 操作按钮*/}
            <div className="content">
              <div className="item-info">
                <span className="content-title">{record.Title}</span>
                <span className="button-right">
                  {record.Status === 8 ? <Button className="operation-btn" onClick={()=>this.getPriceStrategy(record.ID)}>促销更新</Button> :null}
                  {<Button className="operation-btn" onClick={()=>this.goEditEbook(record.ID)}>编辑</Button>}
                  {record.Status === 9  ? <Button className="operation-btn" onClick={()=>{this.handleStartBook(record.ID)}}>上架</Button> :null}
                  {record.Status === 8 ? <Button className="operation-btn" onClick={()=>{this.handleCloseBook(record.ID)}}>下架</Button> :null}
                  {record.Status === 0 || record.Status === 9 ? <Button className="operation-btn" onClick={()=>this.handleDeleteBook(record.ID)}>删除</Button> :null}
              </span>
              </div>
              <div className="item-info">
                {record.PagesCount && <span className="item-one">共{record.PagesCount}页</span>}
                {record.FreeBeginDate && <span className="item-one">限时免费：{record.FreeBeginDate}</span>}
                {record.FreeBeginDate && <span className="item-one">~</span>}
                {record.FreeEndDate && <span className="item-one">{record.FreeEndDate}</span>}
                <span className="item-coin">
                  <span className="coin-item">售价:<span className="item-color">￥{record.SalePrice}</span></span>
                  <span className="coin-item">购买:<span className="item-color">{record.OrderCount}人</span></span>
                  <span className="coin-item">收入:<span className="item-color">￥{record.OrderAmount}</span></span>
                </span>
              </div>
              {record.Summary !== null ? <div className="item-info item-info-one" style={{minHeight:36}}>简介：{PublicFuc.changeString(record.Summary)}</div> : <div className="item-info-one" style={{minHeight:36}}></div>}
              <div className="item-info">
                <span>{this.handleStar(record.Score)}</span>
                <span style={{marginLeft:10,'position':'relative',bottom:2}}>喜欢：<span style={{'color':'#c10d10'}}>{record.PraiseCount}</span></span>
                <span style={{marginLeft:10,'position':'relative',bottom:2}}>不喜欢：<span style={{'color':'#c10d10'}}>{record.NolikeCount}</span></span>
                <span  className="item-two">
                   <span className="one-left"><img src={require('../../../assets/images/see.png')} alt="" style={{position: 'relative', top: '1px'}}/>&nbsp;&nbsp;<span className="middle-p">预览&nbsp;{record.PreReadCount}</span></span>
                   <span className="one-left"><img src={require('../../../assets/images/read.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">阅读&nbsp;{record.ReadCount}</span></span>
                   <span className="one-left"><img src={require('../../../assets/images/favorite.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">收藏&nbsp;{record.FavoriteCount}</span></span>
                   <span className="one-left"><img src={require('../../../assets/images/zhuan.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">分享&nbsp;{record.ShareCount}</span></span>
                   <span className="one-left"><img src={require('../../../assets/images/comment.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">评论&nbsp;{record.CommentCount}</span></span>
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
    ];
  }
  componentDidMount() {
    this.getBookList(1);
  }

  //获取电子书列表
  getBookList = (pIndex,cake) => {
    const {Keyword,Status,CloudID, GID, CreateUID, SortFields,ChareType,sort} = this.state;
    const {current, pageSize} = this.state.pagination;
    Api.Content.getBookList({
        pageIndex: pIndex || current,
        pageSize: pageSize,
        body:{Keyword, Status,CloudID, GID, CreateUID, SortFields:sort,ChareType}
      }
    ).then(res => {
      if(res.Ret===0){
        let dataSource = [];
        const pagination = cake || {...this.state.pagination};
        this.setState({loading: true});
        if (res.Data) {
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          if (res.Data.TotalRecords) {
            let data = res.Data.ViewModelList;
            //操作关联内容数据
            data.map(item => {
              dataSource.push({
                ...item
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

  //处理星星图标
  handleStar = (Score) =>{
    let star = Math.round(Score);
    let starAry=[],starNormal =[];
    for(let i = 0;i<star;i++){
      starAry.push(i);
    }
    for(let i = 0;i<5-star;i++){
      starNormal.push(i);
    }

    const start =
      <span>
        {starAry && starAry.map((e,i) => <img src={require('../../../assets/images/ic_collection_focus.png')} key={i}/>)}
        {starNormal && starNormal.map((e,i) => <img src={require('../../../assets/images/ic_collection.png')} key={i}/>)}
      </span>;

    return start;

  };

  //跳转编辑电子书
  goEditEbook = (id) =>{
    this.props.history.push(`/contents/ebook/editebook/${id}`);
  };

  //操作分页
  handleTableChange = (pagination) =>{
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager});
    this.getBookList(pagination.current);
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
          ContentType:23,
          BeginDate:beginDate,
          EndDate:endDate,
          SalePrice:values.price,
          Desc:values.instruction,
          SNO:'',
          OrderCount:'',
          OrderAmount:''
        };
        Api.Content.savePriceStrategy({body}).then(res=>{
          console.log(res);
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
    Api.Content.getPriceStrategy({contentType:23,contentID:id}).then(res=>{
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

  //下架电子书
  handleCloseBook = (id) => this.setState({visible:true,ContentID:id});

  onChangeCloseDesc = (e) => this.setState({closeDesc: e.target.value});

  handleOk = () =>{
    const {ContentID, closeDesc, pagination} = this.state;
    if (closeDesc === "") {
      message.warning('请输入下架原因');
    } else {
      Api.Content.offShelvesBook({contentID: ContentID, closeDesc: closeDesc}).then(res => {
        if (res.Ret === 0) {
          this.setState({visible: false, ContentType: '', closeDesc: '',}, () => {
            this.getBookList(pagination.current)});
          message.success('下架成功');
        } else {message.error(res.Msg)}
      });
    }
  };

  handleCancel = () => this.setState({visible:false});

  //上架电子书
  handleStartBook = (id) => {
    const {pagination} = this.state;
    Api.Content.shelvesBook({contentID:id}).then(res=>{
      if(res.Ret === 0){
        message.success('上架成功');
        this.getBookList(pagination.current);
      }else {
        message.error(res.Msg);
      }
    })
  };

  //删除电子书
  handleDeleteBook = (id) =>{
    let _this = this;
    confirm({
      title: '是否确定删除该电子书?',
      onOk() {
        Api.Content.deleteBook({contentID: id}).then(res => {
          if (res.Ret === 0) {
            _this.getBookList(1);
            message.success('删除电子书成功');
          } else {
            message.error(res.Msg);
          }
        })
      },
      onCancel() {},
    });
  };


  //操作下拉选项框  是否免费
  handleSelectMoney = (value) =>{
    const {pagination} = this.state;
    this.setState({ChareType: value, SortFields: ''}, () => {this.getBookList(pagination.current);})
  };

  //是否上架
  handleShelves = (value) =>{
    const {pagination} = this.state;
    this.setState({ SortFields: '',Status:value}, () => {this.getBookList(pagination.current);})
  };

  //喜欢数
  handleSort = () => {
    let {pagination, sortOne} = this.state;
    if (sortOne === "1") {
      this.setState({
        sortOne: "-1",
        sort: [{Field: 'PraiseCount', sortType: "-1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    } else if (sortOne === "-1") {
      this.setState({
        sortOne: "1",
        sort: [{Field: 'PraiseCount', sortType: "1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    }
  };

  //阅读
  handleReadCount = () =>{
    let {pagination, sortTwo} = this.state;
    if (sortTwo === "1") {
      this.setState({
        sortTwo: "-1",
        sort: [{Field: 'ReadCount', sortType: "-1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    } else if (sortTwo === "-1") {
      this.setState({
        sortTwo: "1",
        sort: [{Field: 'ReadCount', sortType: "1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    }
  };

  //评论
  handleCommentCount = () =>{
    let {pagination, sortThree} = this.state;
    if (sortThree === "1") {
      this.setState({
        sortThree: "-1",
        sort: [{Field: 'CommentCount', sortType: "-1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    } else if (sortThree === "-1") {
      this.setState({
        sortThree: "1",
        sort: [{Field: 'CommentCount', sortType: "1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    }
  };

  //预览数
  handlePreReadCount = () =>{
    let {pagination, sortFour} = this.state;
    if (sortFour === "1") {
      this.setState({
        sortFour: "-1",
        sort: [{Field: 'PreReadCount', sortType: "-1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    } else if (sortFour === "-1") {
      this.setState({
        sortFour: "1",
        sort: [{Field: 'PreReadCount', sortType: "1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    }
  };

  //购买人数
  handlePreOrderCount = () =>{
    let {pagination, sortFive} = this.state;
    if (sortFive === "1") {
      this.setState({
        sortFive: "-1",
        sort: [{Field: 'OrderCount', sortType: "-1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    } else if (sortFive === "-1") {
      this.setState({
        sortFive: "1",
        sort: [{Field: 'OrderCount', sortType: "1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    }
  };

  //收入
  handlePreOrderAmount = () =>{
    let {pagination, sortSix} = this.state;
    if (sortSix === "1") {
      this.setState({
        sortSix: "-1",
        sort: [{Field: 'OrderAmount', sortType: "-1",}]
      }, () => {
        this.getBookList(pagination.current);
      })
    } else if (sortSix === "-1") {
      this.setState({
        sortSix: "1",
        sort: [{Field: 'OrderAmount', sortType: "1",}]
      }, () => {
        this.getBookList(pagination.current);
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
      sortSix:'1',
      Keyword: '',//机构类型
      Status: '',//内容状态
      ChareType: '',//是否免费
      CloudID: '',//区域云ID
      GID: '',//机构
      CreateUID: '',//创建人
      SortFields: '',//排序字段
      closeDesc:'',//描述
      sort: '',
    },()=>{this.getBookList(1)})
  };

  //底部切换
  swicthPageSize = (cake) => {
    const pager = {...this.state.pagination};
    pager.pageSize = cake.pageSize;
    this.setState({pagination:pager,loading:true},()=>this.getBookList(1))
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
    const {dataSource,loading,closeDesc,pagination,sortOne,sortTwo,sortThree,sortFour,sortFive,sortSix} = this.state;
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
    const iconOne = sortOne === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconTwo = sortTwo === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconThree = sortThree === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconFour = sortFour === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconFive = sortFive === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconSix = sortSix === "1" ? <img src={require('../../../assets/images/ascend.png')} style={{width: 16}} alt=""/> : <img src={require('../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;

    return (
      <div className="eBook">
        <Modal
          title="下架电子书"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <TextArea placeholder="请输入关闭原因" autosize={{minRows: 6, maxRows: 10}} onChange={this.onChangeCloseDesc} value={closeDesc}/>
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
                <TextArea autosize={{minRows: 1, maxRows: 10}} style={{width:'80%'}} placeholder="促销说明不超过30个字" maxLength="30"/>
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
        <div className="eBook-search">
          <Search
            placeholder="搜索"
            onSearch={value => {
               this.setState({Keyword: value, SortFields: ''}, () => {
                  this.getBookList(pagination.current);
               });
            }}
            className="search-value"
          />
        </div>
        {/*下拉选项框*/}
        <Form layout="inline">
          <FormItem label="是否上架">
            <Select defaultValue="全部" style={{width: 120}} onChange={this.handleShelves}>
              <Option value={""}>全部</Option>
              <Option value={"0"}>未上架</Option>
              <Option value={"8"}>已上架</Option>
              <Option value={"9"}>已下架</Option>
            </Select>
          </FormItem>
          <FormItem label="是否收费">
            <Select defaultValue="全部" style={{width: 120}} onChange={this.handleSelectMoney}>
              <Option value={""}>全部</Option>
              <Option value={"0"}>收费</Option>
              <Option value={"1"}>免费</Option>
              <Option value={"2"}>限时免费</Option>
            </Select>
          </FormItem>
        </Form>
        {/*点击排序*/}
        <div className="sort">
          <span style={{position: 'relative', bottom: '2px'}}>排序:</span>
          <span className="sort-item" onClick={this.handleDefault}>默认</span>
          <span className="sort-item" onClick={this.handlePreReadCount}>预览数{iconFour}</span>
          <span className="sort-item" onClick={this.handleReadCount}>阅读数{iconTwo}</span>
          <span className="sort-item" onClick={this.handleCommentCount}>评论数{iconThree}</span>
          <span className="sort-item" onClick={this.handleSort}>喜欢数{iconOne}</span>
          <span className="sort-item" onClick={this.handlePreOrderCount}>购买人数{iconFive}</span>
          <span className="sort-item" onClick={this.handlePreOrderAmount}>收入{iconSix}</span>
          <Button onClick={() => {
            this.props.history.push('/contents/ebook/editebook')
          }} className="sort-btn" size="large">新增电子书</Button>
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
        <Bottom refreshList={(cake) => {this.swicthPageSize(cake)}} pagination={pagination} />
      </div>
    )
  }
}

export default Form.create()(ContentBook);