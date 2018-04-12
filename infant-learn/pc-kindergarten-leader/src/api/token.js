/**
 * Created by QiHan Wang on 2017/8/22.
 * token
 */

import ServiceAsync from './service';
export default {
  getAppToken: (data) => ServiceAsync('GET', 'base/v3/Auth/GetOpenAPITokenByAppid',{data})
}
