/**
 * Created by QiHan Wang on 2017/5/27.
 * 基础常量及项目所环境配置
 */

// 基础配置信息
let Config = {
    version: '1.0.1',
    appId: 1016,
    debug: false,
    api: 'http://api.test.ucuxin.com/',
    // api: 'http://api.ucuxin.com/',
    InRelease: false,   //版本发布中
    //cdn地址
    getPaperCDN: (RandomPaperID) => `http://uxprd.oss-cn-shenzhen.aliyuncs.com/ux/1014/ade/adecontestpaperJson/${RandomPaperID}.json`, //测试
    // getPaperCDN: (RandomPaperID) => `http://img.ucuxin.com/ux/1014/ade/adecontestpaperJson/${RandomPaperID}.json`, //正式
};

// 不同环境下采用不同环境
// let ConfigEvn = {};
//
//   // 开发版本
// if (process.env.NODE_ENV === `development`) {
//   const {ConfigDev} = require('./config.dev');
//   ConfigEvn = ConfigDev;
// }
//
//   // 正式版本
// if (process.env.NODE_ENV === `production`) {
//   alert('sdasd')
//   const {ConfigTest} = require('./config.test');
//   ConfigEvn = ConfigTest;
// }

// Object.assign(Config, ConfigEvn);
export default Config;
