import OSS from 'aliyun-oss-sdk';
import {StorageService} from '../storage';
import ServiceAsync from '../../service';
import Config from '../../config';
import {AppToken} from '../token';

const OSSClient = ({domain, attachType, callback} = {}) => {

  // 获取应用Token
  AppToken().then(res => {
    let token;
    if (typeof res === 'string') {
      token = res;
    } else {
      if (res.Ret === 0 && res.Data) {
        token = res.Data.Token;
        StorageService('session').set('AppToken', token);
        Config.setToken({name: 'appToken', value: token});
      }
    }

    // 获取上传资源名称及OSS配置信息
    const uploadInformation = async () => {
      const promises = [ServiceAsync('GET', 'File/v3/FileBase/GetOSSAccessToken', {token})];
      if (domain && attachType) {
        promises.push(ServiceAsync('GET', 'File/v3/FileBase/GetOSSFileFullFileName', {token, domain, attachType}))
      }
      const [ossAccessToken, fileFullName] = await Promise.all(promises);
      return {fileFullName, ossAccessToken}
    }

    uploadInformation().then(res => {

      console.log(res)
      const fileFullName = (res.fileFullName && res.fileFullName.Ret === 0) && res.fileFullName.Data;
      const creds = (res.ossAccessToken && res.ossAccessToken.Ret === 0) && res.ossAccessToken.Data;

      if (creds) {
        const client = new OSS({
          region: 'oss-cn-shenzhen',
          accessKeyId: creds.AccessKeyId,
          accessKeySecret: creds.AccessKeySecret,
          bucket: creds.BucketName,
          stsToken: creds.SecurityToken
        });

        // 开始上传资源
        callback && callback({objKey: `${creds.RootUrl}/${fileFullName}`, client});
      }
    });
  });
}
export default OSSClient;
