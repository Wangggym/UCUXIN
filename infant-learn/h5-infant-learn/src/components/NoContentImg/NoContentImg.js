/**
 * Created by xj on 2017/10/30.
 * NoContentImg
 */
import React from 'react';
import './NoContentImg.scss';

const NoContentImg = ({firstLoading}) => {
  return (
    <div className="no-content-img">
      {
        firstLoading ? null : <div>
          <img  src={require('../../assets/images/kong.png')} alt=""/>
          <span>暂无数据</span>
        </div>
      }

    </div>
  )

};
export default NoContentImg;
