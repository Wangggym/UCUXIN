import { stringify } from 'qs';
import request from '../utils/request';


//新增资源配置
export async function submitForm_addResConfig(params) {
  return request('/mcs/v3/ConfigWeb/AddResConfig', {
    method: 'POST',
    body: params,
  });
}

// 批量新增学校教材版本
// POST mcs/v3/ConfigWeb/SubmitBookConfig
export async function SubmitBookConfig(params) {
  return request('/mcs/v3/ConfigWeb/SubmitBookConfig', {
    method: 'POST',
    body: params,
  });
}
