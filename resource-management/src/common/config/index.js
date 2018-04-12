/**
 * Created by QiHan Wang on 2017/5/27.
 * 基础常量及项目所环境配置
 */

// 基础配置信息
let Config = {
  version: '1.0.1',
  appId: 206,
  setToken({name = 'token', value} = {}){this[name] = value},
  appToken: sessionStorage['AppToken'],
  token: undefined
};
// 不同环境下采用不同环境
let ConfigEvn = {};
// 本地测试用
if (process.env.NODE_ENV === `development`) {
  // 开发时不需作任何处理
  const {ConfigDev} = require('./config.dev');
  ConfigEvn = ConfigDev;

 // 开发时需要采用Token方式
  /*const {ConfigTest} = require('./config.test');
  ConfigEvn = ConfigTest;*/
}

// 发布到服务器
if (process.env.NODE_ENV === `production`) {
  // 正式服务器
  /*const {ConfigProd} = require('./config.prod');
  ConfigEvn = ConfigProd;*/

  // 测试服务器
  const {ConfigTest} = require('./config.test');
  ConfigEvn = ConfigTest;
}

Object.assign(Config, ConfigEvn);

export default Config;
