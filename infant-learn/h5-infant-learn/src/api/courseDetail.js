/**
 * Created by xj on 2017/9/7
 */


import ServiceAsync from './service';

export default {
  /*-----------------------------------------录播-----------------------------------------------------*/
  //根据课程ID 获取课程详情 介绍
  GetCourseInstro: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetCourseInstro', {...data}),
  //获取课程详情 目录
  GetCourseCatalogs: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetCourseCatalogs', {...data}),
  //通过幼学空间资源ID获取视频存储服务VideoID
  GetVideoIDByResourceID: (data) => ServiceAsync('GET', 'YouLS/v3/VideoH5/GetVideoIDByResourceID', {...data}),
  //根据幼学空间-资源ID获取文件服务的存储Url
  GetFileUrlByResourceID: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetFileUrlByResourceID', {...data}),

  //获取课程详情 考试
  GetCoursePapers: (data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetCoursePapers', {...data}),
  // 生成订单
  CreatOrderInfo:(data)=>ServiceAsync('post', 'YouLS/v3/UserOrderH5/CreatOrderInfo', {...data}),
  // 获取订单详情
  GetOrderDetailByID:(data)=>ServiceAsync('get', 'YouLS/v3/UserOrderH5/GetOrderDetailByID', {...data}),
  // 获取支付签名值
  GetPaySign:(data)=>ServiceAsync('get', 'YouLS/v3/UserOrderH5/GetPaySign', {...data}),
  //获取课程详情 评论 YouLS/v3/CourseH5/GetCourseDiscussPage?courseID={courseID}&pIndex={pIndex}&pSize={pSize}
  GetCourseDiscussPage: (data, page) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetCourseDiscussPage', {...data, ...page}),
  //  新增/回复评论
  AddOrReDiscussInfo: (data) => ServiceAsync('POST', 'YouLS/v3/CourseH5/AddOrReDiscussInfo', {body: {...data}}),
//关注讲师
  FollowLecturer: (data) => ServiceAsync('POST', 'YouLS/v3/LecturerH5/FollowLecturer', {...data}),
//收藏
  FavorCourse: (data) => ServiceAsync('POST', 'YouLS/v3/TrainPlanH5/FavorCourse', {...data}),
  //学习签到
  UserSignCourse: (data) => ServiceAsync('POST', 'YouLS/v3/CourseH5/UserSignCourse', {...data}),
  /*-----------------------------------------录播-----------------------------------------------------*/
  SetLearnRecord:(data) => ServiceAsync('POST', 'YouLS/v3/CourseH5/SetLearnRecord', {...data}),
  GetSID:(data) => ServiceAsync('GET', 'YouLS/v3/CourseH5/GetSID', {...data}),
  /*-----------------------------------------个人-----------------------------------------------------*/

  UpdateStuInfo: (data) => ServiceAsync('POST', 'YouLS/v3/MineH5/UpdateStuInfo',  {...data}),

  /*-----------------------------------------个人-----------------------------------------------------*/
  GetBuyRecord: (data) => ServiceAsync('GET', 'YouLS/v3/UserOrderH5/GetBuyRecord', {...data}),
  //获取个人用户培训学分统计
  GetUserCreditOfYear: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetUserCreditOfYear', {...data}),

  //我的培训学分
  GetUserTrainCreditDetail: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetUserTrainCreditDetail', {...data}),
//我的幼学学分
  GetUserSelfCreditDetail: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetUserSelfCreditDetail', {...data}),

}
