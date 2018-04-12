/**
 * Created by QiHan Wang on 2017/5/27.
 * 基础常量及项目所环境配置
 */

// 基础配置信息
let Config = {
  version: '1.0.1',

  appId: 1016,
  setToken({name, value} = {name: 'token'}) {
    this[name] = value
  },
  appToken: sessionStorage['AppToken'],
};

// 不同环境下采用不同环境
let ConfigEvn = {};
if (process.env.NODE_ENV === `development`) {
  const {ConfigDev} = require('./config.dev');
  ConfigEvn = ConfigDev;
}

if (process.env.NODE_ENV === `production`) {
  // 正式版本
  /*const {ConfigProd} = require('./config.prod');
  ConfigEvn = ConfigProd;*/
  // 测试版本
  const {ConfigTest} = require('./config.test');
  ConfigEvn = ConfigTest;
  // 开发版本
  /*const {ConfigDev} = require('./config.dev');
  ConfigEvn = ConfigDev;*/
}

Object.assign(Config, ConfigEvn);

export default Config;
