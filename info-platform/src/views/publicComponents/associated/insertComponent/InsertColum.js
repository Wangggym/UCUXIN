/**
 * Created by Yu Tian Xiong on 2017/2/8.
 * file:插入专栏
 */
import React,{Component} from 'react';
import {Form,Input,Table,message,Button} from 'antd';
import CommonUpload from '../../commonUpload/CommonUpload';
import Api from '../../../../api';
import './insert.less'

const FormItem = Form.Item;
const Search = Input.Search;

class InsertColum extends Component{


  constructor(props){
    super(props);
    this.state = {
      pagination: {current: 1, pageSize: 5},//分页
      Keyword:'',
      data:{ContentType:21,ContentID:1,Title:null,Thumb:null,Img:null,Url:null},
    };
    this.colums = [
      {
        title: '专栏名称',
        dataIndex: 'Title',
        width:380,
        render: (text, record, index) => (
          (
            <span>{this.handleTitle(record.Title)}</span>
          )
        )
      },
      {
        title: '状态',
        dataIndex: 'StatusName',
      },
      {
        title: '价格',
        dataIndex: 'SalePrice',
      },
    ];
  }

  componentDidMount() {
    this.getScolumnList(1);
    this.getUrl();
  }

  //清空原始记录数据
  componentWillReceiveProps(nextProps) {
    if(nextProps.dataClean && nextProps.dataClean !== this.props.dataClean){
      let {setFieldsValue} = this.props.form;
      setFieldsValue({
        search: nextProps.dataClean.search,
        upload: nextProps.dataClean.upload,
      });
      this.setState({data:{ContentType:21,ContentID:1,Title:null,Thumb:null,Img:null,Url:null}})
    }
  }


  //获取url接口
  getUrl = () =>{
    Api.Info.getUrl().then(res=>{
      console.log(res);
    })
  };

  //获取专栏列表
  getScolumnList= (pIndex) =>{
    const {current, pageSize} = this.state.pagination;
    const {Keyword} = this.state;
    this.setState({loading: true});
    Api.Content.getScolumnList({
      pageIndex: pIndex || current,
      pageSize: pageSize,
      body: {Keyword,Status:8,ChannelID:'',IsFree:'',CloudID:'',GID:'',CreateUID:'',SortFields:''}
    }).then(res=>{
      if(res.Ret===0){
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

  //操作点击的当前行
  rowClick = (record) =>{
    const index = record.ID;
    const data = {
      ...this.state.data,
      Title:record.Title,
      Thumb:record.Thumb,
      ContentID:record.ID,
      Url:`/ZxUser/column/detail?contentID=${record.ID}`,
    };
    this.setState({index,data});
  };

  //表单提交
  sureColum = (e) =>{
    e.preventDefault();
    const {data} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(data.Thumb === null){message.info('请选择列表');return;}
        const DataSource = {...this.state.data,Img:values.upload};
        this.setState({DataSource},()=>{this.props.getValue(false,this.state.DataSource)})
      }
    })
  };

  close = () => this.props.getValue(false);

  //处理专栏名称
  handleTitle = (title) => {
    let Title = title.substr(0);
    if (Title.length > 20) {Title = `${Title.substr(0, 20)}...`}
    return Title;
  };



  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 2},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
    };
    const formItemInput = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 3},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 21},
      },
    };
    const {dataSource,loading,pagination} = this.state;
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 0,
        },
      },
    };
    return(
      <div className="form-item">
        <Form>
          <FormItem  {...formItemLayout}>
            {getFieldDecorator('search', {
              rules: [{ required: false, message: '请搜索专栏' }],
            })(
              <Search
                placeholder="请搜索专栏标题"
                onSearch={value => {
                  this.setState({Keyword: value}, () => {this.getScolumnList(1);});
                }}
              />
            )}
          </FormItem>
          <FormItem  {...formItemLayout}>
              <Table
                rowKey="ID"
                bordered = {false}
                rowClassName={(record,index) => record.ID === this.state.index ? 'no-bordered': ''}
                columns={this.colums}
                onRowClick = {this.rowClick}
                size="small"
                loading={loading}
                dataSource={dataSource}
                pagination={this.state.pagination}
                onChange={this.handleTableChange}
              />
          </FormItem>
          <FormItem label="上传图片" {...formItemInput} extra={this.props.value}>
            {getFieldDecorator('upload', {
              rules: [{ required: true, message: '请上传图片' }],
            })(
              <CommonUpload cover={this.state.cover}/>
            )}
          </FormItem>
          <FormItem  {...tailFormItemLayout}>
            <Button style={{float:'right'}} type="primary" onClick={(e)=>this.sureColum(e)}>确定</Button>
            <Button style={{float:'right',marginRight:10}} onClick={this.close}>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(InsertColum);