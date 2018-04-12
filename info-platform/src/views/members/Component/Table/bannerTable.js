/**
 *  Create by YuTianxiong on 2018/1/15.
 *  fileName: 轮播图
 */
import React, {Component} from 'react';
import {Table, message,Select,Card,Input,Button,Radio,DatePicker,Form} from 'antd';
import Api from '../../../../api';
import ThumbUpload from '../../../publicComponents/thumbload/ThumbUpload';
import moment from 'moment';


const {RangePicker} = DatePicker;
const data = {
  '21': [
    {
      title: '专栏名称',
      dataIndex: 'Title',
    },
    {
      title: '目前状态',
      dataIndex: 'StatusName',
    },
    {
      title: '价格',
      dataIndex: 'SalePrice',
    },
  ],
  '23': [
    {
      title: '电子书名称',
      dataIndex: 'Title',
    },
    {
      title: '目前状态',
      dataIndex: 'StatusName',
    },
    {
      title: '价格',
      dataIndex: 'SalePrice',
    },
  ],
  '25': [
    {
      title: '实物商品名称',
      dataIndex: 'Title',
    },
    {
      title: '目前状态',
      dataIndex: 'StatusName',
    },
    {
      title: '价格',
      dataIndex: 'SalePrice',
    },
  ],
  '11': [
    {
      title: '标题名称',
      dataIndex: 'Title',
    },
    {
      title: '目前状态',
      dataIndex: 'StatusName',
    },
  ],
  '12': [
    {
      title: '标题名称',
      dataIndex: 'Title',
    },
    {
      title: '目前状态',
      dataIndex: 'StatusName',
    },
  ],
  '13': [
    {
      title: '标题名称',
      dataIndex: 'Title',
    },
    {
      title: '目前状态',
      dataIndex: 'StatusName',
    },
  ],
  '14': [
    {
      title: '标题名称',
      dataIndex: 'Title',
    },
    {
      title: '目前状态',
      dataIndex: 'StatusName',
    },
  ],
  '1': [
    {
      title: '标题名称',
      dataIndex: 'Title',
    },
    {
      title: '目前状态',
      dataIndex: 'StatusName',
    },
  ],
};
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class BannerTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      ContentType: '1',//类型
      ChannelID: '',//频道id
      Status: 8,//状态
      IsRefContent: '',//是否关联内容
      Keyword: '',//关键词
      GID: '',
      CreateUID: '',
      pagination: {current: 1, pageSize: 5},//分页
      sort: '',
      loading: false,
      colums: [],
      data:{
        ID:0,
        Status:0,
        GID:null,
        ContentType:null,
        ContentTypeName:null,
        ContentID:null,
        Title:null,
        Thumb:null,
        Url:null,
        ValidType:null,
        BeginDate:null,
        EndDate:null,
        SNO:null,
      }
    };
  }

  //获取资讯(文章 图集 话题 宣传)数据
  getList = (pIndex) => {
    const {ContentType, Keyword} = this.state;
    const {current, pageSize} = this.state.pagination;
    Api.Info.getList({
      pageIndex: pIndex || current,
      pageSize: pageSize,
      body: {ContentType, ChannelID: '', Status: 8, IsRefContent: '', Keyword, GID: '', CreateUID: '', SortFields: ''}
    }).then(res => {
      if (res.Ret === 0) {
        let dataSource = [];
        const pagination = {...this.state.pagination};
        if (res.Data) {
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          if (res.Data.TotalRecords) {
            let data = res.Data.ViewModelList;
            //操作关联内容数据
            data.map(item => {
              dataSource.push({
                ...item,
                Title: this.handleTitle(item.Title)
              })
            })
          }
        }
        this.setState({dataSource, pagination, loading: false});
      } else {
        message.error(res.Msg);
      }
    })
  };

  //获取专栏列表数据
  getScolumnList = (pIndex) => {
    const {current, pageSize} = this.state.pagination;
    const {Keyword} = this.state;
    this.setState({loading: true});
    Api.Content.getScolumnList({
      pageIndex: pIndex || current,
      pageSize: pageSize,
      body: {Keyword, Status: 8, ChannelID: '', IsFree: '', CloudID: '', GID: '', CreateUID: '', SortFields: ''}
    }).then(res => {
      if (res.Ret === 0) {
        let dataSource = [];
        const pagination = {...this.state.pagination};
        if (res.Data) {
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          if (res.Data.TotalRecords) {
            let data = res.Data.ViewModelList;
            //操作关联内容数据
            data.map(item => {
              dataSource.push({
                ...item,
                Title: this.handleTitle(item.Title)
              })
            })
          }
        }
        this.setState({dataSource, pagination, loading: false});

      } else {
        message.error(res.Msg);
      }
    })
  };

  //获取电子书列表数据
  getBookList = (pIndex) => {
    const {current, pageSize} = this.state.pagination;
    const {Keyword} = this.state;
    this.setState({loading: true});
    Api.Content.getBookList({
      pageIndex: pIndex || current,
      pageSize: pageSize,
      body: {Keyword, Status: 8, ChannelID: '', IsFree: '', CloudID: '', GID: '', CreateUID: '', SortFields: ''}
    }).then(res => {
      if (res.Ret === 0) {
        let dataSource = [];
        const pagination = {...this.state.pagination};
        if (res.Data) {
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          if (res.Data.TotalRecords) {
            let data = res.Data.ViewModelList;
            //操作关联内容数据
            data.map(item => {
              dataSource.push({
                ...item,
                Title: this.handleTitle(item.Title)
              })
            })
          }
        }
        this.setState({dataSource, pagination, loading: false});

      } else {
        message.error(res.Msg);
      }
    })
  };


  //获取实物商品列表数据
  getGoodsList = (pIndex) => {
    const {current, pageSize} = this.state.pagination;
    const {Keyword} = this.state;
    this.setState({loading: true});
    Api.Content.getGoodsList({
      pageIndex: pIndex || current,
      pageSize: pageSize,
      body: {Keyword, Status: 8, ChannelID: '', CloudID: '', GID: '', CreateUID: '', SortFields: ''}
    }).then(res => {
      if (res.Ret === 0) {
        let dataSource = [];
        const pagination = {...this.state.pagination};
        if (res.Data) {
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          if (res.Data.TotalRecords) {
            let data = res.Data.ViewModelList;
            //操作关联内容数据
            data.map(item => {
              dataSource.push({
                ...item,
                Title: this.handleTitle(item.Title)
              })
            })
          }
        }
        this.setState({dataSource, pagination, loading: false});

      } else {
        message.error(res.Msg);
      }
    })
  };


  //操作列表分页
  handleTableChange = (pagination) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager});
    if (this.state.ContentType === '21') {
      this.getScolumnList(pagination.current);
    } else if (this.state.ContentType === '23') {
      this.getBookList(pagination.current)
    } else if (this.state.ContentType === '25') {
      this.getGoodsList(pagination.current)
    } else {
      this.getList(pagination.current)
    }
  };

  //点击当前行获取数据
  rowClick = (record) =>{
    console.log(record);
    const index = record.ID;
    const data = {
      ...this.state.data,
      ID:record.ID,
      ContentType:record.ContentType,
      ContentTypeName:this.handleType(record.ContentType),
      ContentID:record.ContentID,
      Title:record.Title,
      Thumb:record.Thumb,
      Url:this.handleUrl(record.ContentType,record.ID) ? this.handleUrl(record.ContentType,record.ID) : record.Url
    };
    console.log(data)
   this.setState({data,index});
  };

  //处理标题过长
  handleTitle = (title)=> {
    let Title = title.substr(0);
    if (Title.length > 16) {
      Title = `${Title.substr(0, 8)}...`
    }
    return Title;
  };
  //选择分类
  chooseClass = (value) =>{
    this.setState({ContentType:value,Keyword:''},()=>{
      this.setState({colums: [...data[this.state.ContentType]]})
      if(this.state.ContentType === '21'){
        this.getScolumnList(1);
      }else if (this.state.ContentType === '23') {
        this.getBookList(1)
      } else if (this.state.ContentType === '25') {
        this.getGoodsList(1);
      } else {
        this.getList(1)
      }
    })
  };

  //搜索列表
  searchList = (value) => {
    const {pagination} = this.state;
    this.setState({Keyword:value},()=>{
      if(this.state.ContentType === '21'){
        this.getScolumnList(pagination.current);
      }else if (this.state.ContentType === '23') {
        this.getBookList(pagination.current)
      } else if (this.state.ContentType === '25') {
        this.getGoodsList(pagination.current);
      } else {
        this.getList(pagination.current)
      }
    });
  };

  //确定选择数据关闭模态
  sureTable = (e) =>{
    e.preventDefault();
    if(this.state.ContentType === '1'){
      message.info('请选择内容分类');
      return;
    }else if(!this.state.data.Thumb) {
      message.info('请选择列表');
      return;
    }else if(!this.state.cover){
      message.info('请上传图片');
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const DataSource = {
          ...this.state.data,
          ValidType: values.IsCharge,
          BeginDate: values.IsCharge ? moment(values.searchDate[0]).format('YYYY-MM-DD HH:mm:ss') :  '',
          EndDate:values.IsCharge ? moment(values.searchDate[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          Thumb:this.state.cover,
          SNO:+values.Sort,
        };
        Api.systemSetting.saveBanner({body:DataSource}).then(res=>{
         if(res.Ret===0){
           this.getBannerList();
           message.success('保存成功');
         }
        })
      }
    })
  };

  close = () => this.props.getData(false);

  //单选按钮选择事件
  isLimite = (e) => this.setState({isLimite: e.target.value});

  //获取轮播列表
  getBannerList = () =>{
    Api.systemSetting.getBannerList().then(res=>{
      this.setState({dataCake:res.Data},()=>{this.props.getData(false,this.state.dataCake)});
    })
  };

  //枚举  类型 显示不同标题
  handleType = (type) => {
    let content = '';
    switch (type) {
      case 21:
        content = '关联专栏';
        break;
      case 23:
        content = '关联电子书';
        break;
      case 25:
        content = '关联实物商品';
      case 11:
        content = '关联文章';
        break;
      case 12:
        content = '关联话题';
        break;
      case 13:
        content = '关联图集';
      case 14:
        content = '关联宣传';
        break;
    }
    return content;
  };

  //根据类型  枚举url
  handleUrl = (type,id) => {
    let url = '';
    switch (type) {
      case 21:
        url = `/ZxUser/column/detail?contentID=${id}`;
        break;
      case 23:
        url = `/ZxUser/book/detail?contentID=${id}`;
        break;
      case 25:
        url = null;
        break;
      case 11:
        url = `/ZxUser/firstPage/article?type=11&id=${id}`;
        break;
      case 12:
        url = `/ZxUser/firstPage/topicView?type=12&id=${id}`;
        break;
      case 13:
        url = `/ZxUser/firstPage/atlas?type=13&id=${id}`;
        break;
      case 14:
        url = `/ZxUser/firstPage/propaganda?type=14&id=${id}`;
        break;
    }
    return url;
  };

  getUploadUrl = (value) => {
    this.setState({cover: value})
  };

  render() {
    const {loading, dataSource} = this.state;
    const formItemInput = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="shuffling">
        <div style={{marginBottom:10}}>
          <Select defaultValue="选择内容分类" style={{ width: 200 }} onChange={this.chooseClass}>
            <Option value="1">选择内容分类</Option>
            <Option value="11">文章</Option>
            <Option value="12">话题</Option>
            <Option value="13">图集</Option>
            <Option value="14">宣传</Option>
            <Option value="21">专栏</Option>
            <Option value="23">电子书</Option>
            <Option value="25">实物商品</Option>
          </Select>
          <Search placeholder="输入标题名称" style={{ width: 200 ,float:'right'}} onSearch={this.searchList}/>
        </div>
        {this.state.ContentType === '1'&&
        <Card title="标题名称"  noHovering={true}>
          <div style={{fontSize:20,textAlign:'center',margin:40}}>请先选择内容分类</div>
        </Card>}
        {dataSource.length !==0 &&
          <Table
            rowKey="ID"
            bordered={false}
            rowClassName={(record, index) => record.ID === this.state.index ? 'no-bordered' : ''}
            columns={this.state.colums}
            onRowClick={this.rowClick}
            size="small"
            loading={loading}
            dataSource={dataSource}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
          }
          <Form style={{marginTop:10}}>
            <FormItem {...formItemInput} label="上传图片">
              <span style={{position: 'relative', right: '70px', fontSize: 12, color: '#f04134', fontFamily: 'SimSun'}}>*</span>
              <ThumbUpload upload={(value) => {this.getUploadUrl(value)}} cover={this.state.cover} cropRate="5:2" size={true}/>
            </FormItem>
              <FormItem {...formItemInput} label="选择有效期">
                {getFieldDecorator(`IsCharge`, {
                  rules: [{required: true, message: '请选择有效期'}]
                })(
                <RadioGroup onChange={this.isLimite}>
                  <Radio value={false}>无限期</Radio>
                  <Radio value={true}>规定时间内</Radio>
                </RadioGroup>
                )}
              </FormItem>
              {
                this.state.isLimite &&
                <FormItem {...formItemInput} label="选择时间">
                  {getFieldDecorator(`searchDate`, {
                    rules: [{required: true, message: '请选择时间'}]
                  })(
                  <RangePicker format={'YYYY-MM-DD HH:mm:ss'} showTime={{format: 'HH:mm:ss'}}/>
                  )}
                </FormItem>
              }
            <FormItem {...formItemInput} label="排序">
              {getFieldDecorator(`Sort`, {
                rules: [{required: true, message: '请填写排序'}]
              })(
                <Input type="number" style={{width:200}}/>
              )}
            </FormItem>
            <FormItem style={{overflow:'hidden',marginTop:10}}>
              <Button style={{float:'right'}} type="primary" onClick={this.sureTable}>确定</Button>
              <Button style={{float:'right',marginRight:10}} onClick={this.close}>取消</Button>
            </FormItem>
          </Form>
      </div>
    )
  }
}

export default Form.create()(BannerTable);

