/**
 * Created by QiHan Wang on 2017/8/12.
 */
import asyncComponent from '../AsyncComponent';

const ResourceList = asyncComponent(() => import('../components/resource-management/ResourceList'));
const SortManagement = asyncComponent(() => import('../components/resource-management/SortManagement'));
const DimensionManagement = asyncComponent(() => import('../components/resource-management/DimensionManagement'));
const AdditionalDimension = asyncComponent(() => import('../components/resource-management/DimensionManagement/AdditionalDimension'));

export default [
  {
    path: '/resource',
    exact: true,
    component: ResourceList
  },
  {
    path: '/category',
    component: SortManagement
  },
  {
    path: '/dimension',
    exact: true,
    component: DimensionManagement
  },
  {
    path: '/dimension/additional',
    component: AdditionalDimension
  },
];
