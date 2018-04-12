import Config from '../config';
import Api from '../api';
import md5 from 'blueimp-md5';
import {StorageService} from './storage';
import {SearchParamName} from './param';
//import md5 from 'blueimp-md5';

// 获取Token服务
export class Token {
  // 发起Token获取
  getAppInfo(callback) {
    this.func = callback;
    window.location.href = "ucux://getappinfo?callback=ongetappinfo";
  }

  // 注册window回调
  registerWinGetApp() {
    window.ongetappinfo = dataStr => {
      let data = JSON.parse(dataStr);

      if (!Config.token || Config.token !== data.AccessToken) {
        sessionStorage.setItem('UCUX_OCS_AccessToken', data.AccessToken);
      }

      if (!Config.currentUcuxVersion || Config.currentUcuxVersion !== data.CurAppVer) {
        sessionStorage.setItem('CurAppVer', data.CurAppVer);
      }
      // 注册回调处理
      if (this.func) {
        this.func(data);
        this.func = null;
      }
    }
  }
}



// 获取用户Token服务
/*export function Token() {
  // 从SessionStorage中读取Token，存在则直接返回
  let token = StorageService('session').get('Token');
  if (token) return token;

  // 开发环境下采用本地Token
  if (process.env.NODE_ENV === `development`) {
    StorageService('session').set('Token', Config.token);
    return Config.token;
  }
  // 生产环境动态获取Token
  if (process.env.NODE_ENV === `production`) {
    if (!window.ongetappinfo) TokenService.prototype.registerWinGetApp();
    TokenService.prototype.getAppInfo(res => {
      Config.setToken(res.AccessToken);
    })
  }

  // 生产环境动态获取Token
  if (process.env.NODE_ENV === `production`) {
    let token = SearchParamName('token'); // 值为字符串或null
    // 如果token 不存在 则跳过设置token
    if(!!token){
      StorageService('session').set('Token', token);
      Config.setToken({value:token});
    }
    return token || undefined;
  }
}*/

//  获取应用Token
export async function AppToken() {
  let token = StorageService('session').get('AppToken');
  if (token) return token;

  const ts = parseInt(new Date().getTime() / 1000);
  return await Api.Base.getAppToken({
    appid: Config.appId,
    ts: ts,
    md5ts: md5(Config.appSecret + ts)
  })
}
