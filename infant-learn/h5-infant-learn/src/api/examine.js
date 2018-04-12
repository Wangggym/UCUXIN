/**
 * Created by QiHan Wang on 2017/9/29.
 * examine
 */

import ServiceAsync from './service';

export default {
  getTrainPlan: data => ServiceAsync('GET', 'YouLS/v3/TrainPlanH5/GetTrainPlanSignUpModel', data),
  getApplyTrainPlan: data => ServiceAsync('GET', 'YouLS/v3/TrainPlanH5/GetApplyOverviewTrainplan', data),

  updateApplyUser: data => ServiceAsync('POST', 'YouLS/v3/TrainPlanH5/ApproveApplyUser', data)
}
