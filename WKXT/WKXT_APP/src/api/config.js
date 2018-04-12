// 基础配置信息
const test_debugger = true // ture => 测试版, false => 正式版

let Config = {
    production_api: '//apitest.ucuxin.com/',   //正式api
    development_api: '//apitest.ucuxin.com/',  //链条后api
    test_api: '//rap2api.taobao.org/app/mock/7019/GET/', // 链条前
    shareUrl: 'http://h.test.ucuxin.com/wkxtapp/',//测试url
    // shareUrl:'http://h.ucuxin.com/wkxtapp/',//正式url
    shareIocn: 'http://uxdev.oss-cn-shenzhen.aliyuncs.com/ux%2F1019%2F%E5%BE%AE%E5%AD%A6%E8%AF%BE%E5%A0%82.png',
    debugger: false, //是否是调试状态  链条前状态 true=> tao.org api
    //分享字段
    learnCourse_share_text: '微课学堂专业的学科辅导专家，提分就靠它，我正在学习，你呢',
    teachRecommend_share_text: '微课学堂专业的学科辅导专家，提分就靠它，快来学习吧',
    teachLearnCourse_share_text: '微课学堂专业的学科辅导专家，提分就靠它，快来学习吧',
    //服务包地址
    servicePackage: (token) => {
        if (test_debugger) return `https://lapptest.ucuxin.com/charge/choice_identity.html?token=${token}&funcid=17`
        return `https://lapptest.ucuxin.com/charge/choice_identity.html`
    },
    //获得token
    getH5TokenParams: () => {
        if (test_debugger) return { appid: 1019, appSecret: 'ad1b650f10404196a6b961f55e4884cb' }
        return { appid: 1000, appSecret: 'ad1b650f10404196a6b961f55e4884cb' }
    },
    //课程列表
    getCourseList: () => {
        if (test_debugger) return 'htest.ucuxin.com/wkxtapp/introduce'
        return 'htest.ucuxin.com/wkxtapp/introduce'
    }
};

Config.api = () => {
    return Config[`${process.env.NODE_ENV}_api`]
}

// 不同环境下采用不同环境
let ConfigEvn = {}

// 开发版本
if (process.env.NODE_ENV === `development`) {
    ConfigEvn = {
        //   token: 'ecfd41bc59f74ecb8d59a7e602171ff2'
        token: '46a86bfa774543ba9bd615df082cf9bc'  // 教师端
    }
}

// 正式版本
if (process.env.NODE_ENV === `production`) {
    ConfigEvn = {}
}

Object.assign(Config, ConfigEvn)

export default Config
