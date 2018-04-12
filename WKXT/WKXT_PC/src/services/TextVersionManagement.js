import { stringify } from 'qs';
import request from '../utils/request';


//     根据GID获取学校教材版本分配列表
// GET mcs/v3/ConfigWeb/GetBookConfigByGID?gid={gid}&phaseID={phaseID}&gradeID={gradeID}&subjectID={subjectID}  
export async function GetBookConfigByGID(params) {
    return request(`/mcs/v3/ConfigWeb/GetBookConfigByGID?${stringify(params)}`)
}

// 批量新增学校教材版本
// POST mcs/v3/ConfigWeb/SubmitBookConfig
export async function SubmitBookConfig(params) {
    return request('/mcs/v3/ConfigWeb/SubmitBookConfig', {
        method: 'POST',
        body: params,
    });
}

// 单个修改保存学校教材版本
// POST mcs/v3/ConfigWeb/AddBookConfig
export async function AddBookConfig(params) {
    return request('/mcs/v3/ConfigWeb/AddBookConfig', {
        method: 'POST',
        body: params,
    });
}

//     删除学校配置的教材
// POST mcs/v3/ConfigWeb/DeleteBookConfig?boolConfigID={boolConfigID}
export async function DeleteBookConfig(params) {
    return request(`/mcs/v3/ConfigWeb/DeleteBookConfig?${stringify(params)}`, {
        method: 'POST',
    });
}

