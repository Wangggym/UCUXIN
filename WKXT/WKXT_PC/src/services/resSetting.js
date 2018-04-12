import { stringify } from 'qs';
import request from '../utils/request';

//新增资源配置
export async function resSetting_create(params) {
    return request('/mcs/v3/ConfigWeb/AddResConfig', {
        method: 'POST',
        body: params,
    });
}
//获取最简单资源配置列表
export async function resSetting_fetch(params) {
    return request(`/mcs/v3/ConfigWeb/GetSimpleResConfigPage?${stringify(params)}`);
}

//根据配置类型+GID获取资源配置详细信息
export async function resSetting_watch(params) {
    return request(`/mcs/v3/ConfigWeb/GetSupplierResConfigByTypeAndGID?${stringify(params)}`);
}

//启用资源配置
export async function resSetting_IsEnableResConfig(params) {
    return request(`/mcs/v3/ConfigWeb/IsEnableResConfig?${stringify(params)}`, {
        method: 'POST',
        body: {},
    });
}

