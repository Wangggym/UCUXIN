/**
 * Created by wym
 *
 */

import ServiceAsync from './service';
import {Token} from '../utils';

export default {
  /** == 园所管理 =================================================================================================== */
  // 培训类型
  GetTrainTypeList: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetTrainTypeList', {token: Token(), ...data}),

  //获取职务
  GetBusinessMemberRoles: (data) => ServiceAsync('GET', 'sns/v3/Web/GetBusinessMemberRoles?mTypeID=11&phase=30010&isGetManager=false', {token: Token(), ...data}),


  // 根据条件获取所有园所信息
  getPageByCondition: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoWeb/GetPageByCondition', {token: Token(), ...data}),

  // 根据登录人获取园所信息
  getGardenInfo: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoWeb/GetGardenInfo', {token: Token(), ...data}),

  // 根据ID获取圆所详情
  getGardenInfoByID: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoWeb/GetGardenInfoByID', {token: Token(), ...data}),

  // 设置示范圆所
  setDemonstration: (data) => ServiceAsync('POST', 'YouLS/v3/GardenInfoWeb/SetDemonstration', {token: Token(), ...data}),

  // 新增圆所信息
  addOrEditGardenInfo: (data) => ServiceAsync('POST', 'YouLS/v3/GardenInfoWeb/AddOrEditGardenInfo', {token: Token(), ...data}),

  // 添加圆所教师
  addOrEditrTeacher: (data) => ServiceAsync('POST', 'YouLS/v3/GardenInfoWeb/AddOrEditrTeacher', {token: Token(), ...data}),

  // 根据园所ID获取教师风采
  getTeachers: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoWeb/GetTeachers', {token: Token(), ...data}),

  // GET YouLS/v3/GardenInfoWeb/GetTeacherByName?name={name}
  // 根据关键字获取园长

  // GET YouLS/v3/DataReportWeb/GetGardenCoursePurchase?sDate={sDate}&eDate={eDate}&pageIndex={pageIndex}&pageSize={pageSize}&courseType={courseType}&roleID={roleID}
  // 园长端--园长身份获取全园人员的购买情况
  GetGardenCoursePurchase: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetGardenCoursePurchase', {token: Token(), ...data}),

  // GET YouLS/v3/DataReportWeb/GetGardenCourseUser?sDate={sDate}&eDate={eDate}&UID={UID}
  // 园长端--获取用户个人购买课程详情
  GetGardenCourseUser: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetGardenCourseUser', {token: Token(), ...data}),


  //园长端--园长身份获取全园人员的学分获得情况
  GetPersonalCreditByGarden: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetPersonalCreditByGarden', {token: Token(), ...data}),

  // 园长端--根据UID获取个人获得学分的详细情况
  GetPersonalCreditDetail: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetPersonalCreditDetail', {token: Token(), ...data}),

  //获取学员
  GetMember: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetMember', {token: Token(), ...data}),

  //园长-课程学习统计（培训课程、自主课程共用）
  GetGardenCourseLearn: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetGardenCourseLearn', {token: Token(), ...data}),

  //根据培训课程获取园内学习的人员列表
  GetGardenUserLearnByPlan: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetGardenUserLearnByPlan', {token: Token(), ...data}),

  //根据自主课程获取园内学习的人员列表
  GetGardenUserLearnByCourse: (data) => ServiceAsync('GET', 'YouLS/v3/DataReportWeb/GetGardenUserLearnByCourse', {token: Token(), ...data}),

}
