/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/commonServe/TrainInfo/api.ts
 * @Description: 描述
 */

/**基础分页查询 */
export const FIND_PAGE = '/trainInfo/findPage';
/**新增培训 */
export const SAVE = '/trainInfo/save';
/**修改课程信息 */
export const UPDATE_COURSE = '/trainInfo/updateCourse';
/**修改考试信息（保存培训或发布培训） */
export const UPDATE_EXAM = '/trainInfo/updateExam';
/**查看培训详情 */
export const FIND_BY_ID = '/trainInfo/findById';
/**重发短信 */
export const RE_SEND_SMS = '/trainInfo/reSendSms';
/**查看答题记录 */
export const QUERY_EXAM_ANSWER_DETAIL = '/trainInfo/queryExamAnswerDetail';
/**修改基本信息 */
export const UPDATE_BASE = '/trainInfo/updateBase';
/**发布培训 */
export const PUBLISH = '/trainInfo/publish';
/**取消发布 */
export const CANCEL_PUBLISH = '/trainInfo/cancelPublish';
/**删除培训 */
export const DELETE = '/trainInfo/delete';
/**学员交流信息分页查询 */
export const STUDENT_MESSAGE_FIND_PAGE = '/trainInfo/studentMessageFindPage';
/**导出学员培训信息 */
export const EXPORT_STUDENT = '/trainInfo/exportStudent';
