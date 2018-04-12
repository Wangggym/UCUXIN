/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {PersonAchievement} from "../../../components"

class MyAchievement extends Component {
  render() {
    return (
      <div className="my-achievement">
        <PersonAchievement tip="请填写个人成就，每个成就以少于8个字符组成，多个成就以分号隔开" limit={50} type={1} {...this.props}/>
      </div>
    )
  }

}

export default MyAchievement;
