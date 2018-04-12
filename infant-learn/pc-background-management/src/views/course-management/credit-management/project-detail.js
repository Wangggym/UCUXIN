/**
 *  Create by xj on 2017/11/16.
 *  fileName: area-detail
 */
import React,{Component} from 'react';
import {Form, Input, Button, Select, DatePicker, Table, message, Row, Col} from 'antd';
import Api from '../../../api';
import {Token} from "../../../utils";
const FormItem = Form.Item;
const Option = Select.Option;
const token = Token();

class ProjectDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      dataSource: [],
    };
    this.columns = [
      {
        title: '区域名称',
        dataIndex: 'AreaName',

      },
      {
        title: '参培人数',
        dataIndex: 'QtyTrainPeople',

      },
      {
        title: '学习人数',
        dataIndex: 'QtyLearn',

      },
      {
        title: '学习率（%）',
        dataIndex: 'RateLearned',

      },
      {
        title: '合格人数',
        dataIndex: 'QtyTrainQualified',

      },
      {
        title: '合格率（%）',
        dataIndex: 'RateQualified',

      },
    ]
  }

  componentDidMount(){
    this.getTableData();
  }
  getTableData=()=>{
    this.setState({loading:true});
    const planID=this.props.match.params.planID;
    const getData={
      token,
      planID:planID
    };
    Api.CourseManagement.GetPlanDetailsByArea(getData).then(res=>{
      if(res.Ret===0){
        this.setState({
          dataSource:res.Data,
          loading:false,
        })
      }else{
        message.warning(res.Msg)
        this.setState({loading:false})
      }
    })
  };

  //查询
  handleSearch = (e) => {
    this.setState({loading: true})
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      this.setState({
        queryFields: Object.assign({}, this.state.queryFields, {
          messageType: values.MessageType || 0,
          IsRead: values.ReadState,
          cnt: values.Name || ""
        }),
        pagination:Object.assign({},this.state.pagination,{
          current:1
        })
      }, () => this.getPageData(this.state.queryFields))
    });
  }
  render(){
    return(
      <div className="area-detail">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
          <Table rowKey="ID" bordered columns={this.columns}
                 style={{marginTop: "0.5rem"}}
                 loading={this.state.loading}
                 dataSource={this.state.dataSource}
          />
        </Form>
      </div>
    )
  }
}
export default Form.create()(ProjectDetail);
