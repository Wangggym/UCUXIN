import {stringify} from 'qs';
import request from '../utils/request';

//获取学校列表
export async function getSchoolList() {
    return request(`/sns/v3/OpenUser/GetGroupByKeyWord?${stringify(params)}`);
}

//获取供应商
export async function GetSupplierList() {
    return request(`/mcs/v3/CourseManageWeb/GetSimpleSupplierList`);
}

//公共接口----根据学段，或+年级获取科目列表
export async function GetPhaseOfStudying(params) {
    return request(`/mcs/v3/ConfigWeb/GetSubjectListByPhase?${stringify(params)}`);
}



// 公共接口----根据学段、年级、科目获取出版社列表
// GET mcs/v3/ConfigWeb/GetPublisherListByPhase?phaseID={phaseID}&gradeID={gradeID}&subjectID={subjectID}
// export async function GetPublisherListByPhase(params) {
//     return request(`/mcs/v3/ConfigWeb/GetPublisherListByPhase?${stringify(params)}`);
// }


// GET mcs/v3/ConfigWeb/GetPublisherList
// 公共接口----获取所有出版社集合
export async function GetPublisherList() {
    return request(`/mcs/v3/ConfigWeb/GetPublisherList`)
}


// 公共接口----获取册别集合
// GET mcs/v3/ConfigWeb/GetFasciculeList?fasciculeID={fasciculeID}
export async function GetFasciculeList(params) {
    return request(`/mcs/v3/ConfigWeb/GetFasciculeList?${stringify(params)}`)
}

//     根据GID获取学校教材版本分配列表
// GET mcs/v3/ConfigWeb/GetBookConfigByGID?gid={gid}&phaseID={phaseID}&gradeID={gradeID}&subjectID={subjectID}
export async function GetBookConfigByGID(params) {
    return request(`/mcs/v3/ConfigWeb/GetBookConfigByGID?${stringify(params)}`)
}

//     公共接口----根据学段，获取年级列表，高中获取模块也是这个接口
// GET mcs/v3/ConfigWeb/GetGradeListByPhase?phaseID={phaseID}
export async function GetGradeListByPhase(params) {
    return request(`/mcs/v3/ConfigWeb/GetGradeListByPhase?${stringify(params)}`);
}

// 公共接口----根据学段，或+年级获取科目列表
// GET mcs/v3/ConfigWeb/GetSubjectListByPhase?phaseID={phaseID}&gradeID={gradeID}	
export async function GetSubjectListByPhase(params) {
    return request(`/mcs/v3/ConfigWeb/GetSubjectListByPhase?${stringify(params)}`)
}

// 公共接口----获取学段、科目、年级属性集合
// GET mcs/v3/ConfigWeb/GetBaseProperList
export async function GetBaseProperList(params) {
    return request(`/mcs/v3/ConfigWeb/GetBaseProperList?${stringify(params)}`)
}