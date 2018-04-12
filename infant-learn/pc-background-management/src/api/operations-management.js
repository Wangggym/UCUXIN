/**
 * Created by QiHan Wang on 2017/8/25.
 * operations-management
 */


import ServiceAsync from './service';
import { Token } from '../utils';
export default {
  /** == 讲师管理 =================================================================================================== */
  // 获取讲师列表
  getLecturerList: (data) => ServiceAsync('GET', 'YouLS/v3/LecturerWeb/GetPageByCondition', data),
  // 获取区域地址
  getAreaList: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetRegion', data),
  //  获取身份类型
  getIDType: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetIDTypeList', data),

  // 讲师级别
  getLecturerLevel: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetLecturerLevelList', data),

  // 新增讲师
  addLecturer: (data) => ServiceAsync('POST', 'YouLS/v3/LecturerWeb/AddLecturer', data),

  // 根据ID获取这都是详细
  getLecturer: data => ServiceAsync('GET', 'YouLS/v3/LecturerWeb/GetLecturerByID', data),

  // 删除讲师
  delLecturer: (data) => ServiceAsync('POST', 'YouLS/v3/LecturerWeb/DelLecturerByID', data),

  /** == 园所管理 =================================================================================================== */

  // 根据条件获取所有园所信息
  getPageByCondition: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoWeb/GetPageByCondition', { token: Token(), ...data }),

  // 根据ID获取圆所详情
  getGardenInfoByID: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoWeb/GetGardenInfoByID', { token: Token(), ...data }),

  // 设置示范圆所
  setDemonstration: (data) => ServiceAsync('POST', 'YouLS/v3/GardenInfoWeb/SetDemonstration', { token: Token(), ...data }),

  // 新增圆所信息
  addOrEditGardenInfo: (data) => ServiceAsync('POST', 'YouLS/v3/GardenInfoWeb/AddOrEditGardenInfo', { token: Token(), ...data }),
  // 根据园所ID获取教师风采
  getTeachers: (data) => ServiceAsync('GET', 'YouLS/v3/GardenInfoWeb/GetTeachers', { token: Token(), ...data }),
}
