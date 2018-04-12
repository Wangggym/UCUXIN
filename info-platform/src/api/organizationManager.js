/**
 *  Create by xj on 2018/1/31.
 *  fileName: organizationManager
 */
import InfoFetch from './fetch';
export default {
    //获取角色清单
    GetOrderContentList: data => InfoFetch('GET', 'ZX/v3/BaseDataGW/GetRoles', data),
    //获取机构成员清单
    GetList: data => InfoFetch('POST', 'ZX/v3/ZXMemberGW/GetList', data),
    //获取机构成员详情
    GetDetail: data => InfoFetch('GET', 'ZX/v3/ZXMemberGW/Get', data),
    //保存机构成员
    AddMember: data => InfoFetch('POST', 'ZX/v3/ZXMemberGW/Save', data),
    //删除机构成员
    DelMember: data => InfoFetch('POST', 'ZX/v3/ZXMemberGW/Delete', data),
    //设置机构成员状态
    SetStatus: data => InfoFetch('POST', 'ZX/v3/ZXMemberGW/SetStatus', data),

}