import ServiceAsync from './service';
// import { Token } from '../utils';
// GetUserByTel: (data) => ServiceAsync('GET', 'base/v3/OpenApp/GetUserByTel', { token: Token(), ...data }),

export default {
    // 培训学习》根据条件获取培训计划
    getPlanPage: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanH5/GetPlanPage', data),
    // 培训学习》根据计划ID获取详情
    getPlanDetailByID: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanH5/GetPlanDetailByID', data),
    // 收藏
    favorCourse: (data) => ServiceAsync('POST', 'YouLS/v3/TrainPlanH5/FavorCourse', data),
    // 购买页面详情
    getPayTrainPlan: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanH5/GetPayTrainPlan', data),
    // 培训公告--根据培训计划ID获取培训计划信息
    getTrainPlanSignUpModel: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanH5/GetTrainPlanSignUpModel', data),
    // 学员报名
    signUpTrainPlan: (data) => ServiceAsync('POST', 'YouLS/v3/TrainPlanH5/SignUpTrainPlan', data),
    // 根据token获取当前登录人的基本人员信息
    getYouLSUser: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanH5/GetYouLSUser', data),
    //获取角色列表
    GetSchMemberRoles: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetSchMemberRoles', data),
    //根据角色类型获取成员信息
    GetSchMembers: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetSchMembers', data),


    //我的课程=========================================
    getMyCoursePage: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetMyCoursePage', data),


    //园所=============================================
    // 根据条件获取所有园所信息
    getPageByCondition: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoH5/GetPageByCondition', data),
    //根据ID获取圆所详情
    getGardenInfoByID: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoH5/GetGardenInfoByID', data),
    //根据园所ID获取教师风采
    getTeachers: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoH5/GetTeachers', data),

    //课程管理H5端=====================================
    // 全部课程
    getAllCoursePage: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetAllCoursePage', data),


    //个人================================================

    // 个人主页，获取我的
    getMine: (data) => ServiceAsync('GET', 'YouLS/v3/MineH5/GetMine', data),

    // 个人主页，点击头像获取详情
    getMineDetail: (data) => ServiceAsync('GET', 'YouLS/v3/MineH5/GetMineDetail', data),

    // 学习档案 按年度统计培训/幼学学分
    getUserYearCredit: (data) => ServiceAsync('GET', 'YouLS/v3/MineH5/GetUserYearCredit', data),


    // 获取我的收藏计划
    getMyFavorPlanPage: (data) => ServiceAsync('GET', 'YouLS/v3/MineH5/GetMyFavorPlanPage', data),
    // 获取我收藏的课程
    getMyFavorCoursePage: (data) => ServiceAsync('GET', 'YouLS/v3/MineH5/GetMyFavorCoursePage', data),

    // 我的培训课程
    getMyPlanCoursePage: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetMyPlanCoursePage', data),

    // 我的自主课程
    getAutonoMyCoursePage: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetAutonoMyCoursePage', data),

    // 获取当前用户的应用积分月度消耗积分明细
    getCurUserPointDetails: (data) => ServiceAsync('GET', 'point/v3/H5/GetCurUserPointDetails', data),


    //我关注的讲师==============================================================
    // 获取名师风采/我关注的讲师
    getLecturerPages: (data) => ServiceAsync('GET', 'YouLS/v3/LecturerH5/GetLecturerPages', data),

    // 根据讲师ID获取讲师详情
    getLecturerDetail: (data) => ServiceAsync('GET', 'YouLS/v3/LecturerH5/GetLecturerDetail', data),

    // 我开设的课程列表
    getHomeMyCoursePage: (data) => ServiceAsync('GET', 'YouLS/v3/LecturerH5/GetHomeMyCoursePage', data),


    // 获取我关注的讲师的开课动态信息（没读取过的）
    getMyLectureDynamic: (data) => ServiceAsync('GET', 'YouLS/v3/LecturerH5/GetMyLectureDynamic', data),

    // 读取讲师动态消息
    readLecturerDynamic: (data) => ServiceAsync('POST', 'YouLS/v3/LecturerH5/ReadLecturerDynamic', data),

    // 关注/取消讲师
    followLecturer: (data) => ServiceAsync('POST', 'YouLS/v3/LecturerH5/FollowLecturer', data),


    //培训公告==================================================================
    // 培训公告--根据培训计划ID获取培训计划信息
    getTrainPlanSignUpModel: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanH5/GetTrainPlanSignUpModel', data),

    // 学员报名
    aignUpTrainPlan: (data) => ServiceAsync('POST', 'YouLS/v3/TrainPlanH5/SignUpTrainPlan', data),


    // DataReportH5
    // 用户学分统计、

    // 获取个人用户培训学分统计（学员+园长首页培训统计报表）--培训+幼学学分上部分
    getUserCreditOfYear: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetUserCreditOfYear', data),

    // 根据年份获取个人获得培训学分明细（获得计划+课程学分列表）--培训学分 下部分 --学习档案培训学习明细
    getUserTrainCreditDetail: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetUserTrainCreditDetail', data),

    // 根据年份获取个人获得幼学学分明细（获得课程学分列表）--幼学学分 下部分 --学习档案自主学习明细
    getUserSelfCreditDetail: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetUserSelfCreditDetail', data),

    // 根据幼学空间-资源ID获取文件服务的存储Url
    getFileUrlByResourceID: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetFileUrlByResourceID', data),

    // 获取专辑详情
    getAlbumCourseInstro: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetAlbumCourseInstro', data),


}
