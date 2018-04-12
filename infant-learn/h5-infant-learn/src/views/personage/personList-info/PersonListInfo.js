/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {PersonAchievement} from "../../../components"

class PersonListInfo extends Component{
  render(){

    return(
      <div className="my-achievement">
        <PersonAchievement tip="请编辑个人简介" limit={60} type={2} {...this.props}/>
      </div>
    )
  }
}

export default PersonListInfo;
