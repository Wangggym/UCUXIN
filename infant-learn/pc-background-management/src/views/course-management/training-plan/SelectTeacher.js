/**
 * Created by xj on 2017/8/24
 */
import React, {Component} from "react";
import {Form, Input, Button, Select, DatePicker, Checkbox, Radio, Row, Col, InputNumber, Icon,Modal,Card} from 'antd';

class SelectTeacher extends Component{
  constructor(props){
    super(props)
    this.state={
      visible:true
    }
  }
//模态框取消
  handleCancel(){
    this.setState({visible:false})
  }
  render(){
    const{visible} = this.state;
    return(
      <Modal
        width="80%"
        visible={visible}
        title="请选择授课讲师"
        onOk={this.handleOk}
        onCancel={()=>this.handleCancel()}
        footer={[
          <Button key="back" size="large">取消</Button>,
          <Button key="submit" type="primary" size="large" >
            确定
          </Button>,
        ]}
      >
        <Card bordered={false} noHovering>
          <Row>
            <Col>

            </Col>
          </Row>
        </Card>
      </Modal>
    )
  }
}
export default SelectTeacher
