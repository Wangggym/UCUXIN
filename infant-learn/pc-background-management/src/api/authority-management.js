import ServiceAsync from './service';
import { Token } from '../utils';
export default {
    //根据电话查询人员
    // tel=15680771011
    GetUserByTel: (data) => ServiceAsync('GET', 'base/v3/OpenApp/GetUserByTel', { token: Token(), ...data }),

    // 获取省市县 GET YouLS/v3/EnumWeb/GetRegion?rid={rid}	
    GetRegion: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetRegion', { token: Token(), ...data }),

    // 获取当前用户所在区域
    GetUserAreaID: (data) => ServiceAsync('GET', 'YouLS/v3/EnumWeb/GetUserAreaID', { token: Token(), ...data }),

    // 根据区域Id获取人员列表  GET YouLS/v3/ManageWeb/GetMangeListByAreaID?AreaID={AreaID}	
    GetMangeListByAreaID: (data) => ServiceAsync('GET', 'YouLS/v3/ManageWeb/GetMangeListByAreaID', { token: Token(), ...data }),

    // 新增编辑权限人员信息 POST YouLS/v3/ManageWeb/AddMange	
    EditorMange: (data) => ServiceAsync('POST', 'YouLS/v3/ManageWeb/AddMange', { token: Token(), ...data }),

    // 删除人员 POST YouLS/v3/ManageWeb/DelMangeByID?ManageID={ManageID}	
    DelMangeByID: (data) => ServiceAsync('POST', 'YouLS/v3/ManageWeb/DelMangeByID', { token: Token(), ...data }),
}