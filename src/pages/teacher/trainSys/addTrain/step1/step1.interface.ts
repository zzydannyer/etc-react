/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step1/step1.interface.ts
 * @Description: 描述
 */
import type { Moment } from 'moment';

export interface TrainBaseInfo {
  /**培训说明	 */
  description: string;
  /**培训名称	 */
  name: string;
  /**结束时间	 */
  endTime: string;
  /**	开始时间	 */
  startTime: string;
  /**学员id列表 */
  studentIdList: number[];
}

export interface SaveTrainBaseInfo extends Omit<TrainBaseInfo, 'endTime' | 'startTime'> {
  trangeTime: [Moment, Moment];
}
