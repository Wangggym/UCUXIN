import ServiceAsync from './ServiceAsync'

export default {
    // 获取当前用户的学校身份列表
    GetUserMembers: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetUserMembers', data),
    // 获取市县校参与情况报表
    GetJoinDetailReport: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetJoinDetailReport', data),
    // 获取我的省市县排名
    GetMyJoinRank: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetMyJoinRank', data),
    // 获取参与情况统计信息
    GetJoinSumInfo: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetJoinSumInfo', data),
    // 获取我的成绩
    GetMyScore: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetMyScore', data),
    // 获取随机试卷
    GetRandomPapar: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetRandomPapar', data),
    // 获取用户剩余答题次数(初赛/复赛)
    GetTestTimes: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetTestTimes', data),
    // 提交答题卡
    SubmitAnswer: (data) => ServiceAsync('POST', 'ADEContest/v3/H5/SubmitAnswer', data),
    // 获取竞赛统计报表
    GetSumInfoReport: (data) => ServiceAsync('GET', 'ADEContest/v3/Web/GetSumInfoReport', data),
    // 获取随机试卷信息[新]
    GetRandomPaparInfo: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetRandomPaparInfo', data),

    /**获取初赛结果**/
    GetPreliminaryResult: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetPreliminaryResult', data),
    //检查是否有资格参加复赛
    CheckSemFinalTicket: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/CheckSemFinalTicket', data),

    /**班级情况**/
    // 获取班主任班级列表
    GetClassList: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetClassList', data),
    // 获取班级参与情况报表
    GetClassJoinReport: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetClassJoinReport', data),

    /**学校统计报表**/
    // 获取学校统计报表
    GetSchoolJoinReport: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetSchoolJoinReport', data),
    // 获得班级排名
    GetClassJoinCountRankReport: (data) => ServiceAsync('GET', 'ADEContest/v3/H5/GetClassJoinCountRankReport', data),

}
