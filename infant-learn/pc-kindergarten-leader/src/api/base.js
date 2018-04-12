/**
 * Created by QiHan Wang on 2017/8/28.
 * base
 */
import md5 from 'blueimp-md5';
import ServiceAsync from './service';
import Config from '../config'

const appId = Config.appId;
const ts = (() => parseInt(new Date().getTime() / 1000))();
const md5ts = md5(Config.appSecret + ts);

export default {
  // 上传附件 包含图片、文件 attachmentStr={}
  upload: (data) => ServiceAsync('POST', `base/v3/OpenAppExt/UploadAttachment`, data),

  // 获取应用Token
  getAppToken: (data) => ServiceAsync('GET', 'base/v3/Auth/GetOpenAPITokenByAppid', ( data || {appId, ts, md5ts,})),

  // 获取当前用户所在区域
  getMangeUser: data => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetMangeUser', data),
}
