import Config from '../config';
import Api from '../api';
import {StorageService} from './storage';
import {SearchParamName} from './param';
import md5 from 'blueimp-md5';

// 获取用户Token服务
export function Token() {
  // 从SessionStorage中读取Token，存在则直接返回
  const token = StorageService('session').get('Token');
  const accessToken = SearchParamName('AccessToken'); // 值为字符串或null

  // 若Token已经存在则验证AccessToken是否等同于当前Token，若验证AccessToken是否为空
  // 若为空或等于当前Token则直接返回当前Token 否则更新当前Token
  if (token){
    if(accessToken === token || !accessToken){
      return token;
    }
  }

  // 开发环境下采用本地Token
  if (process.env.NODE_ENV === `development`) {
    StorageService('session').set('Token', Config.token);
    return Config.token;
  }

  // 生产环境动态获取Token
  if (process.env.NODE_ENV === `production`) {
    //let token = SearchParamName('AccessToken'); // 值为字符串或null
    let token = accessToken;
    // 如果token 不存在 则跳过设置token
    if (!!token) {
      StorageService('session').set('Token', token);
      Config.setToken({value: token});
    }
    return token || undefined;
  }
}

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
