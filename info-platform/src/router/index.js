/**
 * Created by Yu Tian Xiong on 2017/12/11.
 */
import React, { Component } from 'react';
import RouterAll from './router';
import breadcrumbNameMap from './breadcrumb';
const routers = [
    {
        path: '/',
        exact: true,
        component: () => <div>资讯内容发布平台</div>
    },
    ...RouterAll,
];


export default routers;
export { breadcrumbNameMap };
