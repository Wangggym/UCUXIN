/**
 * Created by xj on 2017/7/12.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import EditableTable from './tableContent';
import {Token} from "../../../common/utils/token"

//redux
import ServiceAsync from '../../../common/service';
import './SortManagement.scss';
// -- AntDesign Components
import {Form, Input, Button, Select, Checkbox,message } from 'antd';
const FormItem = Form.Item;
 const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

const token= Token();
class SortManagement extends Component {
  constructor(props){
    super(props)
    this.state = {
      expand: false,
      FieldList:[],
      dataList:[],
      fieldValue:'1',
      loading:false
    };
  }

  componentDidMount(){
    this.setState({
      loading:true
    })
    ServiceAsync('GET', 'Resource/v3/Category/GetDomianList',{token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          FieldList:res.Data
        })

        ServiceAsync('GET', 'Resource/v3/Category/GetCategoryList',{token,
          doMain:this.state.FieldList[0].Value,
          st:""
        }).then(res => {
          if (res.Ret === 0) {
            let dataList = res.Data
            this.setState({
              dataList,
              loading:false
            })
          }
        })
      }
    })
  }
  //弹框提示
   info(){
    message.info('请选择领域');
  };
  handleSearch = (e) => {
    e.preventDefault();
    this.setState({
      loading:true
    })
    this.props.form.validateFields((err, values) => {
      if(!values.Field){
        this.info()
        return;
      }
      console.log('Received values of form: ', values);
      this.setState({
        loadig:true
      })
      ServiceAsync('GET', 'Resource/v3/Category/GetCategoryList',{
        token,
        name:values.ClassName?values.ClassName:"",
        doMain:values.Field,
        st:values.state?values.state:""
      }).then(res => {
        if (res.Ret === 0) {
          let dataList = res.Data
          this.setState({
            dataList,
            loading:false
          })
        }
      })
    });
  }
 //更改领域列表（子操作父）
  changeField(fieldVlaue){
    this.setState({
      fieldValue:fieldVlaue.toString()
    })
  }
  toggle = () => {
    const {expand} = this.state;
    this.setState({expand: !expand});
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    const {getFieldDecorator} = this.props.form;
    const {dataList} = this.state;
    return (
      <div className="category-management">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label={'领域'}>
            {
              getFieldDecorator(`Field`,{initialValue:this.state.fieldValue})(//默认显示子组件的值
                <Select
                  style={{width: 100}}
                  placeholder="领域"
                  optionFilterProp="children"
                  onChange={() => {
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.state.FieldList.map((item,index)=>{
                      return(
                        <Option value={item.Value} key={index}>{item.Text}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem {...formItemLayout} label={'类别名称'}>
            {getFieldDecorator(`ClassName`)(
              <Input placeholder="类别名称"/>
            )}
          </FormItem>
          {/*<FormItem>
            {
              getFieldDecorator(`state`)(
                <Checkbox onChange={this.onChange} style={{marginLeft: 8}}>状态</Checkbox>
              )
            }
          </FormItem>*/}
          <FormItem {...formItemLayout} label={'状态'}>
            {
              getFieldDecorator(`state`,{initialValue:""})(//默认显示子组件的值
                <Select
                  style={{width: 100}}
                  placeholder="全部"
                  optionFilterProp="children"
                  onChange={() => {
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={"false"}>未启用</Option>
                  <Option value={"true"}>已启用</Option>
                  <Option value={""}>全部</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem>
            <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
          </FormItem>
        </Form>
        <EditableTable {...this.props} dataList={dataList} loading={this.state.loading} changeField={(fieldValue)=>this.changeField(fieldValue)}/>
      </div>
    );
  }
}


const mapStateToProps = (state)=> {
 // console.log(state)
  return {
    isEdit: state.editState
  }
}
export default connect(mapStateToProps)(Form.create()(SortManagement));
