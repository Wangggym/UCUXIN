/**
 * Created by QiHan Wang on 2017/5/27.
 */
import Config from '../config';
import {queryString} from '../utils';

const ServiceAsync = (method, url, data) => {

  // 根据传入Url类型 重新组合Url
  if (Object.prototype.toString.call(url) === '[object Object]') {
    url = url.domain + url.url;
  } else {
    url = Config.api + url;
  }

  method = method.toUpperCase(); // 传入方法转为大写

  // 验证是否传入token
  if (!(data && Reflect.has(data, 'token'))) {
    let token = Config.token || sessionStorage.getItem("UCUX_OCS_AccessToken");
    data = Object.assign({token}, (data || {}));
  }

  if (method === 'GET') {
    // 配置查询参数
    if (data) {
      for (let [key, value] of Object.entries(data)) {
        url += `${url.indexOf("?") === -1 ? "?" : "&"}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    }
    // 请求服务器 获取数据
    return fetch(url).then(function (response) {
      return response.json();
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    });

  } else if (method === 'POST') {
    // 配置POST请求参数
    for (let [key, value] of Object.entries(data)) {
      if (key !== 'body') {
        url += `${url.indexOf("?") === -1 ? "?" : "&"}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    }

    let config = {
      method: 'POST'
    };
    if (Object.prototype.toString.call(data.body) === '[object Object]') {
      config = {...config, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: queryString(data.body)}
    } else {
      config = {...config, body: data.body}
    }
    return fetch(url, config).then(function (response) {
      return response.json();
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    });
  }
};

export default ServiceAsync;
