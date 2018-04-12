/**
 * Created by Yu Tian Xiong on 2017/12/22.
 */
import React, {Component} from 'react';
import {Radio,Row, Col} from 'antd';
import {withRouter} from 'react-router-dom';
import './addinfo.less';

const RadioGroup = Radio.Group;

class Addinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    }, () => this.props.getdata(this.state.value));
  };

  render() {
    const {value} = this.state;
    return (
      <div>
        <div className="typeBox">
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio className="radioStyle" value={1}>文章</Radio>
              <Radio className="radioStyle" value={2}>话题</Radio>
              <Radio className="radioStyle" value={3}>图集</Radio>
              <Radio className="radioStyle" value={4}>宣传</Radio>
            </RadioGroup>
          {/*<Row className="box-row" onClick={()=>{this.props.history.push('/news/editarticle');}}>*/}
            {/*<Col span={24}>新增文章</Col>*/}
          {/*</Row>*/}
          {/*<Row className="box-row">*/}
            {/*<Col span={24}>新增话题</Col>*/}
          {/*</Row>*/}
          {/*<Row className="box-row">*/}
            {/*<Col span={24}>新增图集</Col>*/}
          {/*</Row>*/}
          {/*<Row className="box-row">*/}
            {/*<Col span={24}>新增宣传</Col>*/}
          {/*</Row>*/}
        </div>
      </div>
    );
  }
}

export default withRouter(Addinfo);