/**
 * Created by QiHan Wang on 2017/9/5.
 * home
 */

import {AsyncComponent} from '../components';

const Home = AsyncComponent(() => import('../views/home/Home'));

//import Home from '../views/home/Home'

export default [
  {
    path: '/',
    exact: true,
    component: Home
  },
]


