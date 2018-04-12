/**
 *  Create by xj on 2017/11/27.
 *  fileName: index
 */
import React,{Component} from 'react';
import {Form, Button, DatePicker} from 'antd';

import './index.scss';
import PieCharts from './PieCharts';

import Api from '../../../../api';
import {Token} from "../../../../utils";
import moment from 'moment';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const token = Token();
class CourseCount extends Component{
  constructor(props){
    super(props);
    this.state={
      pieData:[],
      sDate:moment(new Date(new Date().getTime() - 7 * 24 * 3600 * 1000)).format(dateFormat),
      eDate:moment(new Date()).format(dateFormat)
    };
    //饼图id
    this.pieID=["trainCourse","expert","topTeacher"]
  }
  componentDidMount(){
    this.getCourseCountData()
  }
  getCourseCountData(sDate,eDate){
    let configData={
      token,
      sdate:sDate||this.state.sDate,
      edate:eDate||this.state.eDate
    };
    Api.CourseManagement.GetAreaCourseTypeStatistic(configData).then(res=>{
      if(res.Ret===0){
        this.setState({pieData:res.Data||[]})
      }
    })
  }
//查询
areaSearch=()=>{
  this.props.form.validateFields((err,values)=>{
    let sDate = values.SeartchSEDate&&values.SeartchSEDate.length!==0&& moment(values.SeartchSEDate[0]).format(dateFormat);
    let eDate = values.SeartchSEDate&&values.SeartchSEDate.length!==0&& moment(values.SeartchSEDate[1]).format(dateFormat);
    this.getCourseCountData(sDate,eDate)
  })
}

  render(){
    const{pieData,sDate,eDate} = this.state;
    const {getFieldDecorator} = this.props.form;
    let searchSEDate = [moment(sDate),moment(eDate)]
    return(
      <div className='course-count'>
        <Form layout="inline" className="form-search-group">
          <FormItem  label="查询起止时间">
            {getFieldDecorator(`SeartchSEDate`, {initialValue:searchSEDate})(<RangePicker format={dateFormat}/>)}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.areaSearch}>查询</Button>
          </FormItem>
          {
            pieData.length!==0?pieData.map((item,key)=>{
              return(
                <PieCharts siglePieData={item} key={key} id={this.pieID[key]}/>
              )
            }): <NoContent/>
          }

        </Form>

      </div>
    )
  }
}
class NoContent extends Component {
  render() {
    return (
      <div className="no-content-chart" >
        暂无数据
      </div>
    )
  }
}
export default Form.create()(CourseCount);
