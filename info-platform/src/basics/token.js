/**
 * Created by Yu Tian Xiong on 2017/12/14.
 */
import UxStorage from './ux-storage';
import config from '../config';
import md5 from 'blueimp-md5';
import params from './params';
import qs from 'qs';



const UCUXIN_TOKEN_USER = 'UCUXIN_TOKEN_USER';// 用户Token
const UCUXIN_TOKEN_APP = 'UCUXIN_TOKEN_APP';  // 应用Token

export default class Token {
    // 获取本地已存在的用户Token
    static getUserToken() {
        return config[UCUXIN_TOKEN_USER] || UxStorage().get(UCUXIN_TOKEN_USER);
    }
    // 获取本地已存在的应用Token
    static getAppToken() {
    return config[UCUXIN_TOKEN_APP] || UxStorage().get(UCUXIN_TOKEN_APP);
    }

    // 设置本地用户Token
    static setUserToken(token) {
        UxStorage().set(UCUXIN_TOKEN_USER, token);
        config[UCUXIN_TOKEN_USER] = token;
    }
  // 设置本地应用Token
    static setAppToken(token) {
      UxStorage().set(UCUXIN_TOKEN_APP, token);
      config[UCUXIN_TOKEN_APP] = token;
    }
  // 从服务器获取最新应用token
    static fetchAppToken() {
      const ts = this.getCurrentTime();
      return fetch(`${config.api}base/v3/Auth/GetOpenAPITokenByAppid?${qs.stringify({
      appid: config.appId,
      ts: ts,
      md5ts: md5(config.appSecret + ts)
      })}`).then(function (response) {
        return response.json();
      }).catch(function (ex) {
        console.log('parsing failed', ex)
      });
  }
    // 获取当前时间戳
    static getCurrentTime() {
        return parseInt(new Date().getTime() / 1000, 10);
    }
    //从服务器获取最新用户token
    static fetchUserToken() {
        //从生产环境获取
        if (process.env.NODE_ENV === `production`) {
            const token = params.searchParamName('AccessToken');// 值为字符串或null
            return new Promise(function (resolve, reject) {
              if (token) {
                resolve({Ret: 0, Data: {Token: token}});
              } else {
                reject('AccessToken is not found！');
              }
            })
        }

        //从开发环境中获取
        if (process.env.NODE_ENV === `development`) {
            const ts = this.getCurrentTime();
            return fetch(`${config.api}base/v3/Auth/GetOpenAPITokenByUser?${qs.stringify({
                uxcode: config.user,
                md5pwd: md5(config.pwd),
                appid: config.appId,
                ts: ts,
                md5ts: md5(config.appSecret + ts)
              })}`).then(function (response) {
                return response.json();
              }).catch(function (ex) {
                console.log('parsing failed', ex)
              });
        }
    }


}

