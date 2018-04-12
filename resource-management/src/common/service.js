/**
 * Created by QiHan Wang on 2017/5/27.
 */
import Config from './config';
import {queryString, Token} from './utils';

const ServiceAsync = (method, url, data) => {
  // 根据传入Url类型 重新组合Url
  if(Object.prototype.toString.call(url) === '[object Object]'){
    url = url.domain + url.url;
  }else{
    url = Config.api + url;
  }

  method = method.toUpperCase(); // 传入方法转为大写

  // 验证是否传入token
  if(!(data && Reflect.has(data, 'token'))){
    data = Object.assign({token: Token()}, (data || {}));
  }

  if (method === 'GET') {
    // 配置查询参数
    if (data) {
      for (let key in data) {
        url += (url.indexOf("?") === -1 ? "?" : "&");
        url += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
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
    for (let key in data) {
      if(key !== 'body'){
        url += (url.indexOf("?") === -1 ? "?" : "&");
        url += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      }
    }


    //console.log(queryString.stringify(data.body));
    //console.log(data.body)
    return fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: queryString(data.body)
    }).then(function (response) {
      return response.json();
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    });
  }
};

export default ServiceAsync;
