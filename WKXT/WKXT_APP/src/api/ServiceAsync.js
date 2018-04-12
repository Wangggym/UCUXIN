import Config from './config';
import { queryString } from './query-string';

if (!Object.entries) {
    require('core-js/fn/object/entries');
}
if (!window.Reflect) {
    require('core-js/fn/reflect');
}
require('babel-polyfill');

const ServiceAsync = (method, url, data, Notdebugger = false) => {
    const timestamp = Date.parse(new Date());
    let newData = { ...data, timestamp }
    // 根据传入Url类型 重新组合Url
    if (Object.prototype.toString.call(url) === '[object Object]') {
        url = url.domain + url.url
    } else {
        if (Notdebugger) {
            url = Config.api() + url
        } else {
            url = Config.debugger ? Config.test_api + url : Config.api() + url
        }
    }

    method = method.toUpperCase(); // 传入方法转为大写

    // 验证是否传入token
    if (!(newData && Reflect.has(newData, 'token'))) {
        let token = sessionStorage.getItem("UCUX_OCS_AccessToken")
        newData = Object.assign({ token }, (newData || {}))
    }

    if (method === 'GET') {
        // 配置查询参数
        if (newData) {
            for (let [key, value] of Object.entries(newData)) {
                url += `${url.indexOf("?") === -1 ? "?" : "&"}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
        }

        // 请求服务器 获取数据
        return fetch(url).then(function (response) {
            return response.json();
        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

    } else if (method === 'POST') {
        // 配置POST请求参数
        for (let [key, value] of Object.entries(newData)) {
            if (key !== 'body') {
                url += `${url.indexOf("?") === -1 ? "?" : "&"}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
        }
        let config = {
            method: 'POST'
        };
        if (Object.prototype.toString.call(newData.body) === '[object Object]') {
            config = {
                ...config,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: queryString(newData.body)
            }
        } else if (Object.prototype.toString.call(newData.body) === "[object Array]") {
            config = {
                ...config,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: queryString({ '': newData.body })
            }
        } else {
            config = { ...config, body: newData.body }
        }
        return fetch(url, config).then(function (response) {
            return response.json();
        }).catch(function (ex) {
            console.log('parsing failed', ex)
        });
    }
};

export default ServiceAsync;

