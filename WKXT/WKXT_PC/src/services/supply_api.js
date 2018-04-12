import { stringify } from 'qs';
import request from '../utils/request';


//供应商列表
export async function get_supply_list(params) {
   return request(`/mcs/v3/CourseManageWeb/GetSimpleSupplierList`);
}
//获取供应商详情
export async function get_basic_supply(params) {
  return request(`/mcs/v3/CourseManageWeb/GetSupplierByID?supplierID=${params}`);
}
//获取课程包详情
export async function get_basic_course(params) {
  return request(`/mcs/v3/CourseManageWeb/GetCoursePackageByID?coursePackageID=${params}`);
}

 
//课程包列表
export async function get_course_list(params) {
   return request(`/mcs/v3/CourseManageWeb/GetSimpleCoursePackageList?${stringify(params)}`);
}

//试看列表
export async function get_trySee_list(params) {
   return request(`/mcs/v3/CourseManageWeb/GetSimpleTrySeePage?${stringify(params)}`);
}

//批量上下架
export async function updateCoursePackage(params) {
  return request(`/mcs/v3/CourseManageWeb/UpdateCoursePackage`,{
        method: 'POST',
        body: params,
    });
}
//批量取消试看
export async function cancelResTrySee(params) {
  return request(`/mcs/v3/CourseManageWeb/CancelResTrySee`,{
        method: 'POST',
        body: {
          TrySeeIDList:params.TrySeeIDList
        },
    });
}
//设置课程包试看
export async function updateResTrySeeByCourse(params) {
  return request(`/mcs/v3/CourseManageWeb/UpdateResTrySeeByCourse?coursePackageID=${params.coursePackageID}&isOpenTry=${params.isOpenTry}`,{
        method: 'POST',
        body: {},
    });
}
//设置单个课时试看
export async function updateResTrySeeByRes(params) {
  return request(`/mcs/v3/CourseManageWeb/UpdateResTrySeeByRes?coursePackageID=${params.coursePackageID}&isOpenTry=${params.isOpenTry}&resourceID=${params.resourceID}`,{
        method: 'POST',
        body: {},
    });
}

//班级
export async function get_Grade(params) {
   return request(`/mcs/v3/ConfigWeb/GetGradeListByPhase?phaseID=${params}`);
}
//科目
export async function get_Subject(params) {
   return request(`/mcs/v3/ConfigWeb/GetSubjectListByPhase?phaseID=${params.phaseID}&gradeID=${params.gradeID}`);
}
//出版社
export async function get_Publish(params) {
   return request(`/mcs/v3/ConfigWeb/GetPublisherListByPhase?phaseID=${params.phaseID}&gradeID=${params.gradeID}&subjectID=${params.subjectID}`);
}
 
