import ServiceAsync from './service';
import {Token} from '../utils';

export default {
  //获取培训类型
  GetTrainTypeList: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetTrainTypeList', data),
  //  获取计划状态
  GetTrainSTList: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetTrainSTList', data),
  //根据条件获取培训计划 GET YouLS/v3/TrainPlanWeb/GetPageByCondition?pIndex={pIndex}&pSize={pSize}&trainST={trainST}&trainType={trainType}&name={name}&st={st}&et={et}
  GetTrainPlan: (data, pIndex, pSize, token) => ServiceAsync('GET', 'YouLS/v3/TrainPlanWeb/GetPageByCondition', {
    ...data,
    pIndex: pIndex,
    pSize: pSize,
    token
  }),
  //获取培训对象
  GetBusinessMemberRoles: (data) => ServiceAsync('GET', 'sns/v3/Web/GetBusinessMemberRoles', {...data}),
  //获取授课方式
  GetTeachWayList: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetTeachWayList', data),
  //根据关键字获取讲师
  GetLecturerSelectList: (data) => ServiceAsync('GET', 'YouLS/v3/LecturerWeb/GetLecturerSelectList', {name: data ? data : ""}),
  //新增编辑计划
  AddOrEditTrainPlan: (data, token) => ServiceAsync('POST', 'YouLS/v3/TrainPlanWeb/AddOrEditTrainPlan', {
    body: data,
    token
  }),
//发布计划
  PublishPlan: (data, token) => ServiceAsync('POST', 'YouLS/v3/TrainPlanWeb/PublishPlan', {...data, token}),
  //市级、区县级发布计划
  PublishSubPlan: (data, token) => ServiceAsync('POST', 'YouLS/v3/TrainPlanWeb/PublishSubPlan', {...data, token}),

//删除计划
  DelTrainPlanByID: (data, token) => ServiceAsync('POST', 'YouLS/v3/TrainPlanWeb/DelTrainPlanByID', {...data, token}),
  //根据ID获取计划详情
  GetPlanByID: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanWeb/GetPlanByID', {...data}),
//根据区域ID获取机构列表
  GetGroupsByRid: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanWeb/GetGroupsByRid', {...data}),
  //根据培训计划ID分页获取报名学员
  GetApplyUserPageByCondition: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanWeb/GetApplyUserPageByCondition', {...data}),
  //获取审核状态
  GetAuditSTList: (token) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetAuditSTList', {token}),
  //审核学员
  ApproveApplyUser: (data) => ServiceAsync('POST', 'YouLS/v3/TrainPlanWeb/ApproveApplyUser', {...data}),
//获取当前用户所在区域
  GetMangeUser: (token) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetMangeUser', {token}),
  //获取当前人的区域集合
  GetCurrentUserArea: (token) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetCurrentUserArea', {token}),

//市级、区县级 分配指标
  DistributionTrainPlan: (data) => ServiceAsync('POST', 'YouLS/v3/TrainPlanWeb/DistributionTrainPlan', {...data}),
//指派详情
  GetDistributionList: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanWeb/GetDistributionList', {...data}),
//获取省市县
  GetRegion: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetRegion', {...data}),
  //获取园所类型
  GetGardenLevelList: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetGardenLevelList', {...data}),



  // 课程管理===========

  // 获取当前用户的培训计划
  GetCourseTypeList: (data) => ServiceAsync('GET', 'YouLS/Help/Api/GET-v3-EnumWeb-GetCourseTypeList', {token: Token(), ...data}),

  GetTrainPlanSelectList: (data) => ServiceAsync('GET', 'YouLS/v3/TrainPlanWeb/GetTrainPlanSelectList', {token: Token(), ...data}),

  // 根据条件获取课程列表
  GetPageByCondition: (data) => ServiceAsync('GET', 'YouLS/v3/CourseWeb/GetPageByCondition', {token: Token(), ...data}),

  // 根据ID获取课程详情
  GetLecturerByID: (data) => ServiceAsync('GET', 'YouLS/v3/CourseWeb/GetCourseByID', {token: Token(), ...data}),

  // 审核课程
  ApproveCourse: (data) => ServiceAsync('POST', 'YouLS/v3/CourseWeb/ApproveCourse', {token: Token(), ...data}),

  // 下架课程
  DownCourse: (data) => ServiceAsync('POST', 'YouLS/v3/CourseWeb/DownCourse', {token: Token(), ...data}),

  //消息管理
  //获取开课状态
  GetMessageTypeList: (token) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetMessageTypeList', token),

  //专家端--获取消息列表
  GetMessageList: (data, pIndex, pSize, token) => ServiceAsync('GET', 'YouLS/v3/MessageWeb/GetPageByCondition',
    {...data, pIndex, pSize, token}),

  //删除消息
  DelMessageByID: (data) => ServiceAsync('POST', 'YouLS/v3/MessageWeb/DelMessageByID', {...data}),//token已加

  //专家端--根据ID获取消息详情
  GetMessageDetailByID: (data) => ServiceAsync('GET', 'YouLS/v3/MessageWeb/GetMessageDetailByID', {...data}),//token已加
  //学分管理
  //获取柱状图数据(区域，项目)
  GetLowerAreaQtyPeople: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetLowerAreaQtyPeople', {...data}),
  //获取按区域的表格数据
  GetLowerAreaReportDateByArea: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetLowerAreaReportDateByArea', {...data}),
//获取按项目表格数据
  GetPlanReportDateByArea: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetPlanReportDateByArea', {...data}),
  //按区域获取查看详情页

  GetCreditReportDateByArea: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetCreditReportDateByArea', {...data}),

  //根据计划ID获取按项目的详情页
  GetPlanDetailsByArea: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetPlanDetailsByArea', {...data}),

  //课程类型
  GetCourseTypeList: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetCourseTypeList', {...data}),

  //统计
  //专家-我开设的课程学习统计（培训课程、自主课程共用）
  GetExpertCourseLearn: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetExpertCourseLearn', {...data}),

  //学分统计 按项目统计的数据
  GetCreditReportDateByPlan: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetCreditReportDateByPlan', {...data}),
//获取角色列表
  GetSchMemberRoles: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportH5/GetSchMemberRoles', {...data}),

//运营--课程统计
  GetAreaCourseTypeStatistic: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetAreaCourseTypeStatistic', {...data}),


}
