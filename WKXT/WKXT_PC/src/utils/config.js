// 基础配置信息
let Config = {
    production_api: '//apftybiz.test.ucuxin.com/',   //正式api
    development_api: '//api.test.ucuxin.com/',  //链条后api
    test_api: '//rap2api.taobao.org/app/mock/6723/GET', // 链条前
    debugger: false //是否是调试状态  链条前状态
};

Config.api = () => {
    if (sessionStorage.getItem('Domain')) return sessionStorage.getItem('Domain')
    return Config[`${process.env.NODE_ENV}_api`]
}

// 不同环境下采用不同环境
let ConfigEvn = {}

// 开发版本
if (process.env.NODE_ENV === `development`) {
    ConfigEvn = {
        token: 'ecbdf12eb1144eabb205b327baee90d1'
    }
}

// 正式版本
if (process.env.NODE_ENV === `production`) {
    ConfigEvn = {}
}

Object.assign(Config, ConfigEvn)

export default Config
