/**
 *  仪表盘api
 */
import InfoFetch from './fetch';
export default {
    //获取机构内容排行--10条数据排行
    GetContentTops: data => InfoFetch('POST', 'ZX/v3/AnalysisGW/GetContentTops', data),
    //获取机构收费总计--第一排
    GetOrderTotal: data => InfoFetch('GET', 'ZX/v3/AnalysisGW/GetOrderTotal', data),
    //按日期获取机构收费统计清单--第一个折线图
    GetOrderCountList: data => InfoFetch('GET', 'ZX/v3/AnalysisGW/GetOrderCountList', data),
    //按日期范围获取机构收费统计汇总--第一个折线图右边数据
    GetOrderSum: data => InfoFetch('GET', 'ZX/v3/AnalysisGW/GetOrderSum', data),
    //获取机构活跃度总计--
    GetBehaviorTotal: data => InfoFetch('GET', 'ZX/v3/AnalysisGW/GetBehaviorTotal', data),
    //按日期获取机构活跃度统计清单--第二个折线图
    GetBehaviorCountList: data => InfoFetch('GET', 'ZX/v3/AnalysisGW/GetBehaviorCountList', data),
    //按日期范围获取活跃用户数--
    GetActiveUserSum: data => InfoFetch('GET', 'ZX/v3/AnalysisGW/GetActiveUserSum', data),
    //按日期范围获取机构活跃度统计汇总--第二个折线图，右侧数据
    GetBehaviorSum: data => InfoFetch('GET', 'ZX/v3/AnalysisGW/GetBehaviorSum', data),
}
