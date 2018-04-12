/**
 * Created by QiHan Wang on 2017/5/27.
 * 用于开发环境下环境常量
 */

export const ConfigDev = {
  api: 'http://api.test.ucuxin.com/',
  // appURl:"http://h.test.ucuxin.com",
  token: sessionStorage['UCUX_OCS_AccessToken'] || (()=> {
    //return '42514169be264f10aeb14703c7bcaa51'; // 王宇

    // return '66b92fe3b7fa4ba6a9d1703c964ad745';// 剔
    // return 'da3d04bcda554643b96c4a0eff8ba164';// 麒
    //  return '94044418d2a74c7a9f8909d1a9d84f27';// 冉
      return 'd26cb6a8e1dd410886f27b6df4816273';// xj
  })(),
  appSecret: '4a66e4e53bcd4c5e9e43241c711698ba' // 1016
};
