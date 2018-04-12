/**
 * Created by Yu Tian Xiong on 2017/1/29.
 * fileName:内容库专栏
 */
import React, { Component } from 'react';
import {Input,Form,Select,message,Button,Table,Modal,Radio,DatePicker} from 'antd';
import Api from '../../../../api';
import PublicFuc from '../../../../basics/publicFuc';
import Bottom from '../../../publicComponents/listBottom/Bottom';
import './smallColum.less';
import moment from 'moment';

const {TextArea} = Input;
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

export default class SmallColum extends Component{

  state = {
    pagination: {current: 1, pageSize: 5},//分页
    ScolumnID:'',//专栏id
    Keyword:'',//查询关键词
    Status:'',//内容状态
    IsFree:'',//是否免费
    CloudID:'',
    GID:'',
    CreateUID:'',
    SortFields:'',
    loading:false,
    data: {type: 0, date: null},//定时发布 立即发布
    sortOne:'1',//预览排序
    sortTwo:'1',//收藏排序
    sortThree:'1',
    sortFour:"1",
    sortFive:'1',
    sort:'',//排序
    closeDesc:'',
  };

  componentDidMount() {
    this.columns =  [
      {
        title: '列表',
        dataIndex: 'List',
        render: (text, record) => (
          <div className="list-item">
            {/*左侧封面图*/}
            <div className="thumb-img">
              <img src={PublicFuc.handleContent(record.Status)} alt="" className="status-img"/>
              {record.Thumb ? <img src={record.Thumb} className="item-img"/> : <img src={record.Thumb} className="item-imgTwo"/>}
            </div>
            {/*右侧细节*/}
            <div className="content">
              {/*标题 操作按钮*/}
              <div style={{marginLeft:6}}>
                <span className="content-qtyItems">【第{record.ItemNo}集】</span>
                <span className="content-title">{record.Title}</span>
                {record.IsFree && <span style={{color:'#c10d10'}}>免费试读</span>}
                <span className="button-right">
                  {record.Status=== 5 ? <Button className="operation-btn" onClick={()=>this.nowPublishSmall(record.ID)}>立即发布</Button> :null}
                  {record.Status=== 0 || record.Status=== 5 || record.Status=== 9 || record.Status === 8? <Button className="operation-btn" onClick={()=>this.goEditSmallColum(record.ID)}>编辑</Button> :null}
                  {record.Status=== 9 ? <Button className="operation-btn" onClick={()=>this.handleStartScolumn(record.ContentType,record.ID)}>开启</Button> :null}
                  {record.Status=== 5 || record.Status=== 8 ? <Button className="operation-btn" onClick={()=>{this.handleSmallColum(record.ID)}}>关闭</Button> :null}
                </span>
              </div>
              {/*发布人 发布时间 等*/}
              <div className="item-info">
                {record.Author && <span className="item-one">主讲人：{record.Author}</span>}
                {record.PublishUName && <span className="item-one">发布人：{record.PublishUName}</span>}
                {record.PublishDate && <span className="item-one">发布时间：{record.PublishDate}</span>}
                {record.PublishTimerDate && <span className="item-one">定时发布时间：{record.PublishTimerDate}</span>}
                {record.CloseUName && <span className="item-one">关闭人：{record.CloseUName}</span>}
                {record.CloseDate && <span className="item-one">关闭时间：{record.CloseDate}</span>}
                <span style={{float: 'right'}}><span style={{marginLeft: '10px'}}><img
                  src={require('../../../../assets/images/PraiseCount.png')}/>&nbsp;&nbsp;<span style={{display:'inline-block',width:20}}>{record.PraiseCount}</span></span>
                  <span style={{marginLeft: '10px'}}><img src={require('../../../../assets/images/NolikeCount.png')}/>&nbsp;&nbsp;<span style={{display:'inline-block',width:20}}>{record.NolikeCount}</span></span></span>
              </div>
              {/*摘要*/}
              {record.Summary !== null ? <div className="item-info item-info-one">{PublicFuc.changeString(record.Summary)}</div> : <div className="item-info-one"></div>}
              {/*排序  预览  收藏 分享*/}
              <div className="item-info">
                <div style={{height:20,marginTop:40}}>
                  <span  className="item-two">
                    <span className="one-left"><img src={require('../../../../assets/images/see.png')} alt="" style={{position: 'relative', top: '1px'}}/>&nbsp;&nbsp;<span className="middle-p">预览&nbsp;{record.ReadCount}</span></span>
                    <span className="one-left"><img src={require('../../../../assets/images/favorite.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">收藏&nbsp;{record.FavoriteCount}</span></span>
                    <span className="one-left"><img src={require('../../../../assets/images/zhuan.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">分享&nbsp;{record.ShareCount}</span></span>
                    <span className="one-left"><img src={require('../../../../assets/images/comment.png')} alt=""/>&nbsp;&nbsp;<span className="middle-p">评论&nbsp;{record.ShareCount}</span></span>
                  </span>
                </div>
              </div>
              {record.CloseDesc && record.Status === 9 ? <div className="item-info" style={{color: '#cf331c'}}>关闭原因:{record.CloseDesc}</div> : null}
            </div>
          </div>
        )
      }
    ];

    if(sessionStorage.getItem('key')){
      this.setState({Title:sessionStorage.getItem('title')})
      this.getSmallColum();
    }
  }
  //跳转编辑专栏小集页面
  goEditSmallColum = (id) => {
    this.props.history.push(`/contents/scolumn/smallscolumn/edit/${id}`);
  };


  //获取专栏小集列表
  getSmallColum = (pIndex,cake) =>{
    const {Keyword,Status,IsFree,CloudID,GID,CreateUID,sort} = this.state;
    const {current, pageSize} = this.state.pagination;
    this.setState({loading: true});
    Api.Content.getSmallColum({
      pageIndex: pIndex || current,
      pageSize: pageSize,
      body: {Keyword,Status,ScolumnID:sessionStorage.getItem('key'),IsFree,CloudID,GID,CreateUID,SortFields:sort}
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
  //操作分页
  handleTableChange = (pagination)=> {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager});
    this.getSmallColum(pagination.current);
  };
  //操作下拉选项框 是否试听 当前状态
  handleListen = (value) =>{
    const {pagination} = this.state;
    this.setState({
      IsFree: value,
      SortFields: ''
    }, () => {this.getSmallColum(pagination.current);})
  };
  handleCurrent = (value) =>{
    this.setState({
      Status: value,
      SortFields: '',
      ContentType: '',
    }, () => {this.getSmallColum(1);})
  };
  //操作按钮-------
  //立即发布专栏小集
  nowPublishSmall = (id) =>{
    let _this = this;
    confirm({
      title: '确定立即发布该资讯吗?',
      onOk() {
        Api.Content.nowPublishSmall({contentID: id}).then(res => {
          if (res.Ret === 0) {
            _this.getSmallColum(1);
            message.success('发布专栏小集成功');
          } else {
            message.error(res.Msg);
          }
        })
      },
      onCancel() {},
    });
  };

  /*-----------------关闭专栏小集-------------------*/
  handleSmallColum = (id) =>{
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
      Api.Content.handleCloseSmall({contentID: ContentID, closeDesc: closeDesc}).then(res => {
        if (res.Ret === 0) {
          this.setState({visible: false, ContentType: '', closeDesc: '',}, () => {
            this.getSmallColum(pagination.current)});
          message.success('关闭成功');
        } else {message.error(res.Msg)}
      });
    }
  };
  handleCancel = () =>this.setState({visible:false});


  /*-----------------开启专栏小集-------------------*/
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
    Api.Content.handleStartSmall({
      contentType: ContentType,
      contentID: ContentID,
      publishSendType: data.type,
      publishTimerDate: data.type === 0 ? '' : moment(data.date).format('YYYY-MM-DD HH:mm:ss'),//定时发布时间
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({startVisible: false, ContentType: ''}, () => {this.getSmallColum(pagination.current);});
        message.success('开启成功');
      } else {
        message.error(res.Msg);
      }
    });
  };
  //取消开启专栏模态
  handleStartCancel = () => this.setState({startVisible:false});


  //排序---------------------

  //预览
  handleReadCount = () =>{
    let {pagination, sortOne} = this.state;
    if (sortOne === "1") {
      this.setState({
        sortOne: "-1",
        sort: [{Field: 'ReadCount', sortType: "-1",}]
      }, () => {
        this.getSmallColum(pagination.current);
      })
    } else if (sortOne === "-1") {
      this.setState({
        sortOne: "1",
        sort: [{Field: 'ReadCount', sortType: "1",}]
      }, () => {
        this.getSmallColum(pagination.current);
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
        this.getSmallColum(pagination.current);
      })
    } else if (sortTwo === "-1") {
      this.setState({
        sortTwo: "1",
        sort: [{Field: 'FavoriteCount', sortType: "1",}]
      }, () => {
        this.getSmallColum(pagination.current);
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
        this.getSmallColum(pagination.current);
      })
    } else if (sortThree === "-1") {
      this.setState({
        sortThree: "1",
        sort: [{Field: 'ShareCount', sortType: "1",}]
      }, () => {
        this.getSmallColum(pagination.current);
      })
    }
  };
  //评论
  handleCommentCount = () =>{
    let {pagination, sortFour} = this.state;
    if (sortFour === "1") {
      this.setState({
        sortFour: "-1",
        sort: [{Field: 'CommentCount', sortType: "-1",}]
      }, () => {
        this.getSmallColum(pagination.current);
      })
    } else if (sortFour === "-1") {
      this.setState({
        sortFour: "1",
        sort: [{Field: 'CommentCount', sortType: "1",}]
      }, () => {
        this.getSmallColum(pagination.current);
      })
    }
  };
  //喜欢
  handlePraiseCount = () => {
    let {pagination, sortFive} = this.state;
    if (sortFive === "1") {
      this.setState({
        sortFive: "-1",
        sort: [{Field: 'PraiseCount', sortType: "-1",}]
      }, () => {
        this.getSmallColum(pagination.current);
      })
    } else if (sortFive === "-1") {
      this.setState({
        sortFive: "1",
        sort: [{Field: 'PraiseCount', sortType: "1",}]
      }, () => {
        this.getSmallColum(pagination.current);
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
      ScolumnID:'',//专栏id
      Keyword:'',//查询关键词
      Status:'',//内容状态
      IsFree:'',//是否免费
      CloudID:'',
      GID:'',
      CreateUID:'',
      SortFields:'',
      loading:false,
      sort: '',
      closeDesc:'',
    },()=>{this.getSmallColum(1)})
  };
  //底部切换
  swicthPageSize = (cake) => {
    const pager = {...this.state.pagination};
    pager.pageSize = cake.pageSize;
    this.setState({pagination:pager,loading:true},()=>this.getSmallColum(1))
  };

  render(){
    const {loading ,dataSource,pagination,closeDesc,data,sortOne,sortTwo,sortThree,sortFour,sortFive} = this.state;
    const iconOne =
      sortOne === "1" ? <img src={require('../../../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
        : <img src={require('../../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconTwo =
      sortTwo === "1" ?
        <img src={require('../../../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
        : <img src={require('../../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconThree =
      sortThree === "1" ?
        <img src={require('../../../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
        : <img src={require('../../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconFour =
      sortFour === "1" ?
        <img src={require('../../../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
        : <img src={require('../../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    const iconFive =
      sortFive === "1" ?
        <img src={require('../../../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
        : <img src={require('../../../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
    return(
      <div className="SmallColum">
        <div className="colum-header">
          <h2 className="subject">{this.state.Title}</h2>
        </div>
        {/* 关闭专栏小集 */}
        <Modal
          title="关闭专栏小集"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
                    <TextArea placeholder="请输入关闭原因" autosize={{minRows: 6, maxRows: 10}}
                              onChange={this.onChangeCloseDesc} value={closeDesc}/>
        </Modal>
        {/* 开启专栏小集 */}
        <Modal
          title="开启专栏小集"
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
        <div className="colum-search">
          <Search
            placeholder="搜索"
            onSearch={value => {
              this.setState({Keyword: value, SortFields: ''}, () => {
                this.getSmallColum(pagination.current);
              });
            }}
            className="search-value"
          />
        </div>
        <Form layout="inline">
          <FormItem label="是否试读">
            <Select defaultValue="全部" style={{width: 120}} onChange={this.handleListen}>
              <Option value={""}>全部</Option>
              <Option value={"true"}>是</Option>
              <Option value={"false"}>否</Option>
            </Select>
          </FormItem>
          <FormItem label="当前状态">
            <Select defaultValue="全部" style={{width: 120}} onChange={this.handleCurrent}>
              <Option value={""}>全部</Option>
              <Option value={"0"}>草稿</Option>
              <Option value={"1"}>审核中</Option>
              <Option value={"2"}>不通过</Option>
              <Option value={"3"}>编辑发布</Option>
              <Option value={"5"}>定时发布</Option>
              <Option value={"8"}>已发布</Option>
              <Option value={"9"}>已关闭</Option>
              <Option value={"11"}>已结束</Option>
            </Select>
          </FormItem>
        </Form>
        {/*点击排序*/}
        <div className="sort">
          <span style={{position: 'relative', bottom: '2px'}}>排序:</span>
          <span className="sort-item" onClick={this.handleDefault}>默认</span>
          <span className="sort-item" onClick={this.handleReadCount}>预览数{iconOne}</span>
          <span className="sort-item" onClick={this.handleCommentCount}>评论数{iconFour}</span>
          <span className="sort-item" onClick={this.handleFavoriteCount}>收藏数{iconTwo}</span>
          <span className="sort-item" onClick={this.handleShareCount}>分享数{iconThree}</span>
          <span className="sort-item" onClick={this.handlePraiseCount}>喜欢数{iconFive}</span>
          <Button onClick={()=>{this.props.history.push(`/contents/scolumn/smallscolumn/edit`)}} className="sort-btn" size="large">新增小集</Button>
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