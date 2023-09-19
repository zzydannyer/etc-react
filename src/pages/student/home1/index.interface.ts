/**
 * 未完成培训列表
 */
export interface TrainInfoList {
  answerTime: number;
  courseId: number;
  createBy: string;
  createById: number;
  createTime: string;
  delFlag: number;
  description: string;
  endTime: string;
  examPaperId: number;
  id: number;
  joinNumber: number;
  lastUpdateBy: string;
  lastUpdateById: number;
  lastUpdateTime: string;
  maxExamTimes: number;
  name: string;
  notice: string;
  passingScore: number;
  startTime: string;
  status: number;
}

/**
 * 学员首页信息
 */
export interface StudentHomeInfo {
  /** 考试结果（-1：未考试，0：未通过 1：已通过） */
  isExamPass: number;
  isStudyFinis: number; // 是否完成学习课程（0：否 1：是）
  /**当前培训数量 */
  shouldFinishTrainNum: number;
  studentTrainId: number; // 学员培训id
  studyProgress: number; // 学习完成进度百分比
  /**学习时长（分钟） */
  studyTime: number;
  /**是否完成学习课程（0：否 1：是） */
  isStudyFinish: number;
  /**考试剩余次数 */
  surplusExamTimes: number;
}

export interface Question {
  question: string;
  answer: string;
  id: number;
}
