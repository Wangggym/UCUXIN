/**
 *  Create by xj on 2018/1/8.
 *  fileName: order
 */
import InfoFetch from './fetch';
export default {
    //获取内容订单列表
    GetOrderContentList: data => InfoFetch('POST', 'ZX/v3/OrderGW/GetOrderContentList', data),
    //获取内容订单统计
    GetOrderContentSum: data => InfoFetch('POST', 'ZX/v3/OrderGW/GetOrderContentSum', data),
    //获取内容包订单列表
    GetOrderPackageList: data => InfoFetch('POST', 'ZX/v3/OrderGW/GetOrderPackageList', data),
    //获取内容包订单统计
    GetOrderPackageSum: data => InfoFetch('POST', 'ZX/v3/OrderGW/GetOrderPackageSum', data),

}