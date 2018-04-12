/**
 * Created by QiHan Wang on 2017/8/12.
 */
import React from 'react';
import resource from './resource';        // 资源管理
import flies from './flies';              // 文件管理
import question from './questions-bank';  // 题库组卷
import menu from './menu'                 // 菜单角色管理

import breadcrumbNameMap from './breadcrumb';
import NotFoundPage from '../components/NotFoundPage';
const routers = [
  {
    path: '/',
    exact: true,
    component: () => <div>资源组织平台</div>
  },
  ...resource,
  ...flies,
  ...question,
  ...menu,
  {
    path: '/404',
    component: NotFoundPage
  }
];
export default routers;
export {breadcrumbNameMap};
