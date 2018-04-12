import React, {Component} from 'react';
import {Link} from 'react-router-dom';

const Home = () => {

  return (
    <ul>
      <li><Link to="/train-learn/1">培训学习</Link></li>
      <li><Link to="/expert-mien">专家风采</Link></li>
      <li><Link to="/train-learn/2">专家讲座</Link></li>
      <li><Link to="/parkList">示范园所</Link></li>
      <li><Link to="/train-learn/3">名师示范课</Link></li>
      <li><Link to="/train-notice/131385643027010967/128684508412010499">培训公告</Link></li>
      <li><Link to="/personage">个人</Link></li>
      <li><Link to="/examination">考试</Link></li>
      <li><Link to="/examine/127935510844010027/128684508412010499/1">审核</Link></li>
      <li><Link to="/train-score/1">查看报表</Link></li>
      <li><Link to="/purchase-record">购买记录</Link></li>
    </ul>
  )
}


export default Home;
