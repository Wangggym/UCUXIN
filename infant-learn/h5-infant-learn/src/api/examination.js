/**
 * Created by QiHan Wang on 2017/9/18.
 * examination
 */

import ServiceAsync from './service';

export default {
  // 根据试卷获取题目的接口（无答案）
  getQuestions: data => ServiceAsync('GET', 'YouLS/v3/PaperH5/GetQuestionsNoAnswerByPaperID', data),

  // 开始答题，获取答题sign值
  getAnswerSign: data => ServiceAsync('GET', 'YouLS/v3/PaperH5/GetAnswerSign', data),

  // 提交（试卷、作业）题目的接口（答题时间加密）
  savePaper: data => ServiceAsync('POST', 'YouLS/v3/PaperH5/SubmitPaper', data)

}
