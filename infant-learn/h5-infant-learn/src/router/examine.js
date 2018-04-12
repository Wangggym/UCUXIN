/**
 * Created by QiHan Wang on 2017/9/30.
 * examine
 */
import { AsyncComponent } from '../components';
// 审核
const HasEnroll = AsyncComponent(() => import('../views/examine/HasEnroll'));
const ExaminePage = AsyncComponent(() => import('../views/examine/ExaminePage'));

export default [
  //审核
  {
    path: '/examine/:trainPlanID/:gId/:isUser',
    component: HasEnroll,
    exact:true,
  },
  {
    path: '/examine/:trainPlanID/:gId/:isUser/examine-page',
    component: ExaminePage,
  }
];
