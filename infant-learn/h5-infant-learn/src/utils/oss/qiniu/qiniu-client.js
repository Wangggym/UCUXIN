/**
 * Created by QiHan Wang on 2017/9/13.
 * client
 */
import ServiceAsync from '../../../api/service';
//import {Token} from '../../token';
import Config from '../../../config'

const qiniuClient = ({domain, attachType, callback} = {}) => {
  const token = Config.token;

  const uploadInformation = async () => {
    const promises = [ServiceAsync('GET', 'YouLS/v3/Vedio/GetVideoUploadToken', {token})];
    if (domain && attachType) {
      promises.push(ServiceAsync('GET', 'YouLS/v3/Vedio/GetOSSFileFullFileName', {token, domain, attachType}))
    }
    const [ossAccessToken, fileFullName] = await Promise.all(promises).catch(err => console.log(err));
    return {fileFullName, ossAccessToken}
  };

  uploadInformation().then(res => {
    const fileFullName = (res.fileFullName && res.fileFullName.Ret === 0) && res.fileFullName.Data;
    const uploadToken = (res.ossAccessToken && res.ossAccessToken.Ret === 0) && res.ossAccessToken.Data;

    if (uploadToken && fileFullName) {
      // 开始上传资源
      callback && callback({objKey: fileFullName, uploadToken});
    }
  })
}
export default qiniuClient;
