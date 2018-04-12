import React from 'react'
import {Form, Radio, Input, Button, message} from 'antd'
import './ConditionSearch.scss'
import api from '../../../api'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Search = Input.Search;

class ConditionSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courseTypeID: [],
      teachWay: [],
      courseType: '0'
    }
  }

  componentDidMount() {
    this.getCourseTypeList()
    this.getTeachWayList()
  }

  //课程类型
  getCourseTypeList() {
    api.MyHomepage.getCourseTypeList().then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        this.setState({courseTypeID: [{Text: "全部", Value: "0", IsChecked: false}, ...res.Data]})
        this.checkLoadingStatusFirstChange()
      } else {
        message.info(res.Msg)
      }
    })
  }

  //授课方式
  getTeachWayList() {
    api.Basics.getTeachWayList().then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        this.setState({teachWay: [{Text: "全部", Value: "0", IsChecked: false}, ...res.Data]})
        this.checkLoadingStatusFirstChange()
      } else {
        message.info(res.Msg)
      }
    })
  }

  handleSearch = (value) => {

    //this.props.onChange({ name: value.trim() })

    this.props.onChange({name: (this.state.searchName || '' ).trim()})
  }

  checkLoadingStatusFirstChange() {
    const {courseTypeID, teachWay} = this.state
    // if (courseTypeID && courseTypeID.length && teachWay && teachWay.length) {
    //   this.props.onChange(this.props.form.getFieldsValue())
    // }
    if (courseTypeID && courseTypeID.length) {
      this.props.onChange(this.props.form.getFieldsValue())
    }
  }

  getNodes(data) {
    const array = []
    data.forEach(({Value, Text}) => {
      array.push(<Radio value={Value} key={Value}>{Text}</Radio>)
    })
    return array
  }

  handleCourseTypeChange = (courseType) => {
    this.setState({courseType})
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {courseTypeID, teachWay} = this.state
    return (
      <Form layout="inline" className="form-search-group">
        {
          courseTypeID && courseTypeID.length ? <FormItem label={'课程类型'} className="line-block">
            {getFieldDecorator(`courseTypeID`, {initialValue: courseTypeID[this.props.initCourseType].Value})(
              <RadioGroup onChange={e => this.handleCourseTypeChange(e.target.value)}>
                {this.getNodes(courseTypeID)}
              </RadioGroup>
            )}
          </FormItem> : null
        }
        {
          teachWay && teachWay.length && this.state.courseType !== '4' ?
            <FormItem label={'授课方式'} className="line-block">
              {getFieldDecorator(`teachWay`, {initialValue: '0'})(
                <RadioGroup>
                  {this.getNodes(teachWay)}
                </RadioGroup>
              )}
            </FormItem> : null
        }
        <FormItem label='课程名称' className="line-block">
          {/*<Search
                        placeholder="输入课程名称查询"
                        style={{ width: 200 }}
                        onSearch={this.handleSearch}
                    />*/}
          <Input placeholder="输入课程名称查询" style={{width: 200}}
                 onChange={(e) => this.setState({searchName: e.target.value})}/>
          <Button type="primary" style={{marginLeft: 8}} onClick={this.handleSearch}>查询</Button>
        </FormItem>
      </Form>
    )
  }
}

//限定控件传入的属性类型
ConditionSearch.propTypes = {}

//设置默认属性
ConditionSearch.defaultProps = {}

export default Form.create({
  onValuesChange: (props, values) => {
    props.onChange(values)
  }
})(ConditionSearch)
