/**
 * Created by QiHan Wang on 2017/7/17.
 */
import Mock from 'mockjs';
import Config from '../common/config';
import {Token} from '../common/utils';
const token = Token();

Mock.mock(`${Config.api}Resource/v3/Dim/GetPhaseList?token=${token}`, {
  data: {
    'name': '@name',
    'age|1-100': 100,
    'color': '@color'
  }
});
