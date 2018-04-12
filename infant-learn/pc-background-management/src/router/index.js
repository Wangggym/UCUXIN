/**
 * Created by QiHan Wang on 2017/8/12.
 */
import React from 'react';
import OperationsManagement from './operations-management'  ;               // 运营管理
import CourseManagement from './course-management';                         //课程管理

import breadcrumbNameMap from './breadcrumb';
import NotFoundPage from '../views/other/NotFoundPage';
const routers = [
  {
    path: '/',
    exact: true,
    component: () => <div>资源组织平台</div>
  },
  ...OperationsManagement,
  ...CourseManagement,
  {
    path: '/404',
    component: NotFoundPage
  }
];
export default routers;
export {breadcrumbNameMap};
