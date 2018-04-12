/**
 * Created by Yu Tian Xiong on 2017/12/13.
 * 常量和项目环境配置
 */

 //不同换环境的不同配置

 let configEnvir = {};
 if (process.env.NODE_ENV === `development`) {
    configEnvir = require('./config.dev');
 }

 if (process.env.NODE_ENV === `production`) {
    // configEnvir = require('./config.prod')
    configEnvir = require('./config.test');
 }

 const config = {
    version: '1.0.1',
    appId: 1016,
    user:'13798558667',
   // user:'17554163091',
    pwd:'123456',
    ...configEnvir.default
 };

 export default config;
