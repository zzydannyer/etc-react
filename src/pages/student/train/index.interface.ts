/**
 * 我的培训列表信息
 */
export interface MyTrainListInfo {
  company: string; // 单位
  endTime: string; // 结束时间
  examTimes: number; // 已用考试次数
  idCardNo: string; // 身份证号
   /** 考试结果（-1：未考试，0：未通过 1：已通过） */
  isExamPass: number;
  /**是否完成学习课程（0：否 1：是） */
  isStudyFinish: number;
  maxExamTimes: number; // 总考试次数
  mobilePhone: string; // 手机
  score: number; // 成绩
  startTime: string; // 开始时间
  studentId: number; // 学员id
  studentName: string; // 姓名
  studentTrainId: number; // 学员培训记录id
  surplusExamTimes: number; // 剩余考试次数
  trainName: string; // 培训名称
  trainId: number; // 培训id
  /**是否可以培训 1:未开始 2 进行中 3 已结束 */
  status: number;
  /**总分 */
  totalScore: number;
  /**	及格分数 */
  passingScore: number
}

/**
 * 查看成绩
 */
export interface ExamScore {
  createBy: string; //创建人
  createById: number; // 创建人id
  createTime: string; //创建时间
  delFlag: number; //	是否删除 1：已删除 0：正常
  id: number; // 主键id
  isPass: number; //是否合格（0：不合格 1：合格）
  lastUpdateBy: string; //更新人
  lastUpdateById: number; //更新人id
  lastUpdateTime: string; // 更新时间
  score: number; // 成绩
  studentTrainId: number; //	培训记录id
}

export interface UrlState {
  /**学员培训记录id */
  studentTrainId: string;
  /**小节id */
  currentSectionId: string;
  /**视频id */
  videoId: string;
}
