/**
 * Created by QiHan Wang on 2017/9/13.
 * client
 */
import ServiceAsync from '../../../api/service';
import {Token} from '../../token';

const qiniuClient = ({callback} = {}) => {
  const token = Token();

  const uploadInformation = async () => {
    const ossAccessToken = await ServiceAsync('GET', 'YouLS/v3/Vedio/GetVideoUploadToken', {token});
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
