/**
 * Created by QiHan Wang on 2017/9/13.
 * client
 */
import ServiceAsync from '../../../service';
import {Token} from '../../token';

const qiniuClient = ({callback} = {}) => {
  const token = Token();

  const uploadInformation = async () => {
    const ossAccessToken = await ServiceAsync('GET', 'Resource/v3/Video/GetTokenSign', {token}).catch(err => console.log(err));
    return {ossAccessToken}
  };

  uploadInformation().then(res => {
    const uploadToken = (res.ossAccessToken && res.ossAccessToken.Ret === 0) && res.ossAccessToken.Data;

    if (uploadToken) {
      // 开始上传资源
      callback && callback({uploadToken});
    }
  })
}
export default qiniuClient;
