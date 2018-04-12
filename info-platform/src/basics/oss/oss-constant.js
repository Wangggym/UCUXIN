/**
 * Created by QiHan Wang on 2017/10/27.
 * E-Mail: whenhan@foxmail.com
 * File Name: oss-constant
 */
// 云存储配置
export default {
  ali: {
    region: 'oss-cn-shenzhen',
    apiFileName: 'ZX/v3/FileGW/GetOSSFileFullFileName',
    apiAccessToken: 'ZX/v3/FileGW/GetOSSAccessToken'
    // apiFileName: 'ZX/v3/BaseDataGW/GetOSSFileFullFileName',
    // apiAccessToken: 'ZX/v3/BaseDataGW/GetOSSAccessToken'
  },
  qiniu:{
    url: 'http://upload.qiniu.com/',
    apiAccessToken:'Resource/v3/Video/GetTokenSign'
  }
}
