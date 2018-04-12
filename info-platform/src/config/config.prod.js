/**
 * Created by Yu Tian Xiong on 2017/12/13.
 * 生产环境下
 */

const https = process.env.HTTPS === 'true' && process.env.NODE_ENV === 'production';
const protocol = https ? 'https' : 'http';

 export default {
     api: `${protocol}://api.ucuxin.com/`,
     appSecret: '',
     appAddress: `${protocol}://m3.ucuxin.com/`,
 }