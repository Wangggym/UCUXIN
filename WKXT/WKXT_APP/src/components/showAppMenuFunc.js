/**
  * 判断浏览器类型
  */
const isBrowser = () => {
    let u = navigator.userAgent;
    let browser = {
        pc: false,
        type: 0, //type = 1优信/2微信/3QQapp/4QQ浏览器Android版
    };
    let IsPC = () => {
        let Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
            if (u.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    };
    if (IsPC()) {
        browser.pc = true;
    } else {
        browser.pc = false;
    }
    if (u.indexOf('Android') >= 0) {
        if (u.indexOf('UCUX_WebBrowser') >= 0) {
            browser.type = 1;
        } else if (u.indexOf('MicroMessenger') >= 0) {
            browser.type = 2;
        } else if (u.indexOf('MicroMessenger') < 0 && u.indexOf('QQ') >= 0) {
            browser.type = 3;
        } else if (u.indexOf('MicroMessenger') < 0 && u.indexOf('MQQBrowser') >= 0) {
            browser.type = 4;
        }
    }
    if (u.indexOf('iPhone') >= 0) {
        if (u.indexOf('UCUX_WebBrowser') >= 0) {
            browser.type = 1;
        } else {
            if (u.indexOf('MicroMessenger') >= 0) {
                browser.type = 2;
            }
            if (u.indexOf('QQ') >= 0) {
                browser.type = 3;
            }
        }
    }
    return browser;
}

export default () => {
    let browser = isBrowser()
    if (browser.type === 1) {
        window.location.href = 'ucux://webview?action=setMenu&Level=1';
    }
}