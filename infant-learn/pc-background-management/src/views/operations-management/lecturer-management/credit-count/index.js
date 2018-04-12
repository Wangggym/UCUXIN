/**
 *  Create by xj on 2017/11/20.
 *  fileName: index
 */
import React, {Component} from 'react';
import {Form, Input, Button, Tabs, Select, Table, message} from 'antd';
import Api from '../../../../api';
import {Token} from "../../../../utils";
import TabCreditCount from './TabCreditCount';

const token = Token();
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;


class CreditCount extends Component {
  constructor(props) {
    super(props);
    this.state={
      type:"1"//1=按区域  2=按项目
    }
  }

  //切换选项卡
  tabSwitch = (value) => {
    this.setState({type:value})
  };

  render() {
    const{type}=this.state;
    return (
      <div className="credit-count">
        <Tabs defaultActiveKey="1" onTabClick={(value) => this.tabSwitch(value)}>
          <TabPane tab="按区域统计" key="1">
            <TabCreditCount type={type}/>
          </TabPane>
          <TabPane tab="按项目统计" key="2">
            <TabCreditCount type={type}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Form.create()(CreditCount);
