import OSS from 'aliyun-oss-sdk';
import InfoFetch from '../../../api/fetch';
import Token from '../../token';
import ossConfig from '../oss-constant';

// 获取身份权限
const fetchAuth = ({token, domain, attachType, callback} = {}) => {
  // 获取上传资源名称及OSS配置信息
  const uploadInformation = async () => {
    const promises = [InfoFetch('GET', ossConfig.ali.apiAccessToken, {token,domain})];
    if (domain && attachType) {
      promises.push(InfoFetch('GET', ossConfig.ali.apiFileName, {token, domain, attachType}))
    }
    const [ossAccessToken, fileFullName] = await Promise.all(promises);
    return {fileFullName, ossAccessToken}
  };

  uploadInformation().then(res => {
    const fileFullName = (res.fileFullName && res.fileFullName.Ret === 0) && res.fileFullName.Data;
    const creds = (res.ossAccessToken && res.ossAccessToken.Ret === 0) && res.ossAccessToken.Data;

    if (creds) {
      const client = new OSS({
        region: ossConfig.ali.region,
        accessKeyId: creds.AccessKeyId,
        accessKeySecret: creds.AccessKeySecret,
        bucket: creds.BucketName,
        stsToken: creds.SecurityToken
      });
      const rootUrl = creds.RootUrl;
      // 开始上传资源
      callback && callback({objKey: `${fileFullName}`, client , rootUrl});
    }
  });
};

//阿里云客户端配置
const aliClient = ({domain, attachType, callback} = {}) => {
  let token;
  if (Token.getUserToken()) {
    token = Token.getUserToken();
    fetchAuth({token, domain, attachType, callback});
  } else {
    Token.fetchUserToken().then(res => {
      if (res.Ret === 0) {
        token = res.Data.Token;
        Token.setUserToken(token);
        fetchAuth({token, domain, attachType, callback});
      } else {
        console.error(res.Msg);
      }
    });
  }
};
export default aliClient;
