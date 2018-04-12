/**
 * Created by Yu Tian Xiong on 2017/2/8.
 * file:插入电子书
 */
import React,{Component} from 'react';
import {Form,message,Input,Table,Button} from 'antd';
import Api from '../../../../api';
import './ueditorArticle/ueditorArticle.less';

const FormItem = Form.Item;
const Search = Input.Search;

class InsertArticleEbook extends Component{

  constructor(props){
    super(props);
    this.state = {
      pagination: {current: 1, pageSize: 5},//分页
      Keyword:'',
      data:{ContentType:23,ContentID:1,Title:null,Thumb:null,Img:null,Url:null,SalePrice:null},
    };
    this.colums = [
      {
        title: '电子书名称',
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
        width:50
      },
      {
        title: '价格',
        dataIndex: 'SalePrice',
        width:50
      },
    ];
  }

  componentDidMount() {
    this.getBookList(1);
  }

  //清空原始记录数据
  componentWillReceiveProps(nextProps) {
    if(nextProps.dataClean && nextProps.dataClean !== this.props.dataClean){
      let {setFieldsValue} = this.props.form;
      setFieldsValue({search: nextProps.dataClean.search});
      this.setState({data:{ContentType:23,ContentID:1,Title:null,Thumb:null,Img:null,Url:null,SalePrice:null}})
    }
  }

  //获取电子书列表
  getBookList= (pIndex) =>{
    const {current, pageSize} = this.state.pagination;
    const {Keyword} = this.state;
    this.setState({loading: true});
    Api.Content.getBookList({
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
    this.getBookList(pagination.current);
  };

  //操作点击的当前行
  rowClick = (record) =>{
    const index = record.ID;
    console.log(record);
    const data = {
      ...this.state.data,
      Title:record.Title,
      Thumb:record.Thumb,
      ContentID:record.ID,
      Url:`/ZxUser/book/detail?contentID=${record.ID}`,
      SalePrice:record.SalePrice
    };
    this.setState({index,data});
  };

  //表单提交
  sureBook = (e) =>{
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

  //处理电子书名称
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
              rules: [{ required: false, message: '请搜索电子书名称' }],
            })(
              <Search
                placeholder="请搜索电子书名称"
                onSearch={value => {
                  this.setState({Keyword: value}, () => {this.getBookList(pagination.current);});
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
          <FormItem  {...tailFormItemLayout}>
            <Button style={{float:'right'}} type="primary" onClick={(e)=>this.sureBook(e)}>确定</Button>
            <Button style={{float:'right',marginRight:10}} onClick={this.close}>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(InsertArticleEbook);