/**
 * Created by QiHan Wang on 2017/10/13.
 * base
 */
import ServiceAsync from '../common/service';
export default {
  getCurrentUserInfo: data=> ServiceAsync('GET','Resource/v3/Resource/GetCurrentUserInfo', data)
}
