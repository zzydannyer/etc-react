/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/commonServe/ExamPaperInfo/api.ts
 * @Description: 试卷
 */
/**查询试卷下拉框 */
export const QUERY_COMBO_BOX = '/examPaperInfo/queryComboBox';

/**查看试卷详情 */
export const FIND_BY_ID = '/examPaperInfo/findById';

/**新增大题 */
export const SAVE_SUBJECT = '/examPaperInfo/saveSubject';

/**修改大题 */
export const UPDATE_SUBJECT = '/examPaperInfo/updateSubject';

/**删除大题 */
export const DELETE_SUBJECT = '/examPaperInfo/deleteSubject';

/**新增大题选择题目 */
export const SAVE_SUBJECT_TOPIC = '/examPaperInfo/saveSubjectTopic';

/**修改题目分数 */
export const UPDATE_TOPIC_SCORE = '/examPaperInfo/updateTopicScore';

/**删除大题选择题目 */
export const DELETE_SUBJECT_TOPIC = '/examPaperInfo/deleteSubjectTopic';

/**修改试卷名称 */
export const UPDATE_EXAM_PAPER = '/examPaperInfo/updateExamPaper';
