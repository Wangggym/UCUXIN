var titleArray = [
    { key: 'catalog', value: '课程目录' },
    { key: 'collectList', value: '收藏' },
    { key: 'courseList', value: '课程列表' },
    { key: 'learnRecord', value: '学习记录' },
    { key: 'searchList', value: '搜索' },
    { key: 'learnCourse', value: '课程学习' },
    { key: 'thisWeekRank', value: '本周排名' },
    { key: 'conLearnList', value: '连续学习详情' },
    { key: 'home', value: '微课学堂' },
    { key: 'introduce', value: '微课学堂' },
    { key: 'studentReport', value: '每周荣誉榜 ' },
    { key: 'subjectLearnDetail', value: '学科观看率详情' },
    { key: 'learningReport', value: '学习报告' },
    { key: 'pointsItem', value: '积分明细' },
    { key: 'pointsRank', value: '积分排名' },
    { key: 'pointsRuler', value: '积分规则' },
    { key: 'studyDetails', value: '学习详情' },
    { key: 'buyResult', value: '选择服务包' },
    { key: 'timeFrame', value: '学习时段分布' },
    { key: 'classReport', value: '班级学习报告' },
    { key: 'teacherReport', value: '班级周报' },
    { key: 'learnDaysList', value: '学习天数详情' },
]
var titleType = {}
for (var i = 0; i < titleArray.length; i++) {
    titleType['/' + titleArray[i].key] = titleArray[i].value
}

export default (pathname) => {
    for (var key in titleType) {
        if (pathname.indexOf(key) !== -1) {
            document.title = titleType[key];
            //存储标题
            sessionStorage.setItem("title", encodeURIComponent(titleType[key]))
        }
    }
}