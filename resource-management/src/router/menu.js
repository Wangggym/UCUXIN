/**
 * Created by QiHan Wang on 2017/8/12.
 */
import asyncComponent from '../AsyncComponent';
const MenuManage = asyncComponent(() => import('../components/menu/MenuManage'));
const RoleManage = asyncComponent(() => import('../components/menu/RoleManage'));

export default [
  {
    path: '/menu-management',
    component: MenuManage
  },
  {
    path: '/role-management',
    component: RoleManage
  },
]
