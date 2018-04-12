/**
 * Created by Yu Tian Xiong on 2017/12/11.
 */
import Config from '../config';
import qs from 'qs';
import Token from '../basics/token'

const InfoFetch = function (method, url, data) {
    // 根据传入Url类型 重新组合Url
    if (Object.prototype.toString.call(url) === '[object Object]') {
        url = (url.domain || '') + (url.url || '');
    } else {
        url = Config.api + url;
    }

    method = method.toUpperCase(); // 传入方法转为大写

    // 验证是否传入token
    if (!(data && Reflect.has(data, 'token'))) {
        const token = Token.getUserToken();
        if (token) {
            data = Object.assign({ token }, (data || {}));
        } else {
            return new Promise(function (resolve, reject) {
                reject(`Interface: "${url}" Token is not found!`);
            });
        }
    }

    // 开发测试
    if (process.env.NODE_ENV === `development`) Object.assign(data, {});

    if (method === 'GET') {

        url += qs.stringify(data, { addQueryPrefix: true });  //'?a=b&c=d'

        // 请求服务器 获取数据
        return fetch(url).then(function (response) {
            return response.json();
        }).catch(function (ex) {
            console.log('parsing failed', ex);
        });

    } else if (method === 'POST') {
        // 配置POST请求参数
        // 方法一  遍历属性和值
        for (let [key, value] of Object.entries(data)) {
            if (key !== 'body') {
                url += `${url.indexOf("?") === -1 ? "?" : "&"}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
        }

        let config = { method: 'POST' };
        const isObject = Object.prototype.toString.call(data.body) === '[object Object]';
        const isArray = Object.prototype.toString.call(data.body) === '[object Array]';
        if (isObject || isArray) {
            config = {
                ...config,
                // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                // body: qs.stringify(isArray ? { '': data.body } : data.body) //是数组'a[0]=b'  是对象 '?a=b&c=d'
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data.body)

            };
        } else {
            config = { ...config, body: data.body }
        }
        return fetch(url, config).then(function (response) {
            return response.json();
        }).catch(function (ex) {
            console.log('parsing failed', ex)
        });
    }
};

export default InfoFetch;

