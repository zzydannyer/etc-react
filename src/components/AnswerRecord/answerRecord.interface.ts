/*
 * @Author: 关朝伟
 * @FilePath: /evdata-exam/src/components/AnswerRecord/answerRecord.interface.ts
 * @Description: 答题记录接口
 */
export interface AnswerObj {
  /** 考试时间 */
  createTime: string;
  /** 考试id */
  examId: number;
  /** 是否合格（0：不合格 1：合格） */
  isPass: number;
  /** 成绩 */
  score: number;
  /** 培训记录id */
  studentTrainId: number;
  /** 题目列表 */
  subjectTopicVOList: subjectTopicVO[];
}

export interface subjectTopicVO {
  /** 答案 */
  answer: string;
  /** 题干内容 */
  content: string;
  /** 题目id */
  id: number;
  /** 是否正确（0：否 1：是） */
  isTrue: number;
  /** 分数 */
  score: number;
  /** 大题id */
  subjectId: number;
  /** 大题关联题目id */
  subjectTopicId: number;
  /** 学员答案 */
  submitAnswer: string;
  /** 选项列表 */
  topicOptionDetailVOList: topicOptionDetailVO[];
  /** 试题类型 */
  type: string;
}

export interface topicOptionDetailVO {
  /** 是否答案（0：否 1：是） */
  isAnswer: number;
  /** 是否学员提交的答案（0：否 1：是） */
  isStudentSubmit: number;
  /** 选项内容 */
  optionContent: string;
  /** 选项id */
  optionId: string;
}
