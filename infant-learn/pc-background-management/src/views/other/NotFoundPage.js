/**
 * Created by QiHan Wang on 2017/8/25.
 * index
 */

import React, {Component} from 'react';
import {Alert} from 'antd';

const NotFoundPage = (props)=> <Alert
    message="404"
    description="您所访问的页面跑路啦~~~！."
    type="info"
    showIcon
  />

export default NotFoundPage
