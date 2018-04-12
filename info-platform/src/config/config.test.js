/**
 * Created by Yu Tian Xiong on 2017/12/13.
 * 测试环境下
 */

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

export default {
    api: `${protocol}://api.test.ucuxin.com/`,
    appSecret: '4a66e4e53bcd4c5e9e43241c711698ba', //1016
    appAddress: `${protocol}://m.test.ucuxin.com/`,
}