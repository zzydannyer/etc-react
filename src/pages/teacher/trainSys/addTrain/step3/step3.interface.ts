/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step3/step3.interface.ts
 * @Description: 描述
 */

/**考试信息 */
export interface TrainExamForm {
  /**答题时间(分钟） */
  answerTime: number;
  /**试卷id */
  examPaperId: number;
  /**考试须知	 */
  notice: string;
  /**可考次数 */
  maxExamTimes: number;
  /**及格分数 */
  passingScore: number;
}
