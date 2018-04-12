/**
 * Created by QiHan Wang on 2017/8/15.
 * question-bank
 * 试题组卷模块API配置
 */
import ServiceAsync from '../common/service';
import {Token} from '../common/utils';
const token = Token();

export default {
  getDomain: () => ServiceAsync('GET', 'Resource/v3/Category/GetDomianList',{token}),
  // 获取适用对象
  getCrowds: () => ServiceAsync('GET', 'Resource/v3/Category/GetPeopleList',{token}),
  getTags: (domain) => ServiceAsync('GET', 'Resource/v3/Resource/TagList', { token, domain }),
  // 获取分类
  getCategory: (doMain, property = 0, parentID = 0) => ServiceAsync('GET', 'Resource/v3/Category/GetCategoryListByParentID', { token, doMain, property, parentID }),
  // 获取题难易
  getDifficulty: () => ServiceAsync('GET', 'QuePap/v3/Question/GetDifficulty',{token}),
  // 获取题类型
  getQuestionType: () => ServiceAsync('GET', 'QuePap/v3/Question/GetQuestionType', {token}),
  // 新增选择题
  addChoiceQuestion: (data) => ServiceAsync('POST', 'Resource/v3/QuePap/AddChoiceQuestion', {token, ...data}),
  // 新增选择题
  addJudgeQuestion: (data) => ServiceAsync('POST', 'Resource/v3/QuePap/AddJudgeQuestion', {token, ...data}),

  // 新增题
  addQuestion: data => ServiceAsync('POST', 'Resource/v3/QuePap/AddQuestion', {token, ...data}),

  // POST_新增试卷的接口
  AddPaper: (data) => ServiceAsync('POST', 'Resource/v3/QuePap/AddPaperNew', {token, ...data}),
}
