/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/typings/train.d.ts
 * @Description: 培训 课程 相关
 */
// import type { Moment } from 'moment';

/**培训列表信息 */
interface TrainListInfo {
  /** xxx*/
  id: number;
  /** 培训名称*/
  name: string;
  /** 考试须知*/
  notice: string;
  /** 状态（0：未发布 1：未开始 2：进行中 3：已结束 4：已作废）*/
  status: number;
  /** 及格分数*/
  passingScore: string;
  /** 参加人数	*/
  joinNumber: string;
  /** 答题时间(分钟）*/
  answerTime: number;
  /** 课程id*/
  courseId: number;
  /** 试卷id	*/
  examPaperId: number;
  /** 开始时间*/
  startTime: string;
  /** 结束时间*/
  endTime: string;
  /** 状态（0：未发布 1：未开始 2：进行中 3：已结束 4：已作废）*/
  statusName: string;
}

/**小节信息 */
interface Section {
  /**课件地址 */
  coursewareUrl: string;
  /**	介绍 */
  description: string;
  /**	名称 */
  name: string;
  /**视频上传id */
  videoId: string;
  /**学习进度 */
  studyPercent: number;
  /**时长（秒） */
  duration: number;
  /**小节id */
  sectionId: number;
  /**学习进度（秒） */
  progress: number;
  /**视频名称 */
  title: string;
}

/**章信息 */
interface Chapter {
  /**	章id	 */
  chapterId: number;
  /**章名称 */
  name: string;
  /**小节列表 */
  sectionVOList: Section[];
}

/**课程信息 */
interface CourseDetail {
  /**课程id */
  courseId: number;
  /**课程名称 */
  name: string;
  /**课程分类	 */
  type: number;
  /**章列表 */
  chapterVOList: Chapter[];
  /**课程分类	 */
  typeName: string;
}

/**选项信息 */
interface TopicOptionDetail {
  /**	是否答案（0：否 1：是） */
  isAnswer: number;
  /**是否学员提交的答案（0：否 1：是） */
  isStudentSubmit: number;
  /**选项内容 */
  optionContent: string;
  /**选项id */
  optionId: string;
}

/**	小题目信息 */
interface SubjectTopic {
  /**答案 */
  answer: string;
  /**	题干内容 */
  content: string;
  /**是否正确（0：否 1：是） */
  isTrue: number;
  /**分数 */
  score: number;
  /**大题关联题目id */
  subjectTopicId: number;
  /**题目id */
  id: number;
  /**	试题类型 */
  type: number;
  /**题型 */
  typeName: string;
  /**选项信息 */
  topicOptionDetailVOList: TopicOptionDetail[];
  /**课程分类 */
  courseTypeName: string;
}

/**大题信息 */
interface Subject {
  /**名称 */
  name: string;
  /**每题分数 */
  score: number;
  /**大题id */
  subjectId: number;
  /**大题总分 */
  subjectScore: number;
  /**题目数量 */
  topicNum: number;
  /**试题类型 1:单选题 2:多选题 3:判断题 */
  topicType: number;
  /**试题类型 1:单选题 2:多选题 3:判断题 */
  topicTypeName: string;
  /**	题目列表 */
  subjectTopicVOList: SubjectTopic[];
}

/**试卷信息 */
interface ExamPaperDetail {
  /**总答题时间	 */
  answerTime: number;
  /**试卷id	 */
  examPaperId: number;
  /**总分	 */
  totalScore: number;
  /**名称 */
  name: string;
  /**	大题列表 */
  subjectVOList: Subject[];
}

/**查看培训详情 */
interface TrainDetial extends TrainListInfo {
  /**课程信息 */
  courseDetailVO: CourseDetail;
  /**小节总数 */
  totalSectionNum: number;
  /**已完成小节数量 */
  finishedSectionNum: number;
  /**	可考次数 */
  maxExamTimes: number;
  /**培训说明 */
  description: string;
  /**答题时间(分钟） */
  answerTime: number;
  /**试卷信息 */
  examPaperDetailVO: ExamPaperDetail;
  /**学员列表 */
  studentTrainVOList: StudentTrainVO[];
  /**当前看的哪个小节 */
  currentSectionId: number;
}

/**有考试的学员信息 */
interface StudentTrainVO {
  /** 单位 */
  company: string;
  /** 结束时间 */
  endTime: string;
  /** 已用考试次数 */
  examTimes: number;
  /** 身份证号 */
  idCardNo: string;
  /** 考试结果（-1：未考试，0：未通过 1：已通过） */
  isExamPass: number;
  /** 是否完成学习课程（0：否 1：是） */
  isStudyFinish: number;
  /** 总考试次数 */
  maxExamTimes: number;
  /** 手机 */
  mobilePhone: string;
  /** 成绩 */
  score: number;
  /** 开始时间 */
  startTime: string;
  /** 学员id */
  studentId: number;
  /** 姓名 */
  studentName: string;
  /** 学员培训记录id */
  studentTrainId: number;
  /** 剩余考试次数 */
  surplusExamTimes: number;
  /** 培训名称 */
  trainName: string;
  /** 学员id*/
  id: number;
  /**是否登录过系统（0：否 1：是） */
  loginStatus: number;
  /**状态（0：禁用 1：启用） */
  studentStatus: number;
}

/**学员列表 */
interface StudentListInfo {
  /**入库培训状态（0：未通过 1：已通过） */
  firstTrainStatus: number;
  /**	身份证号 */
  idCardNo: string;
  /**	手机 */
  mobilePhone: string;
  /**		姓名   */
  name: string;
  /**	状态（0：禁用 1：启用） */
  status: number;
  /**单位 */
  company: string;
  /** */
  id: number;
}

/**课程基本信息 */
interface ComboBox {
  /**是否可以编辑（0：否 1：是） */
  canUpdate: number;
  /**课程id */
  courseId: number;
  /**课程名称 */
  name: string;
}

/**试卷基础信息 */
interface ExamPaperBaseInfo {
  /**是否可以编辑（0：否 1：是） */
  canUpdate: 0 | 1;
  /**	试卷id */
  examPaperId: number;
  /**名称		 */
  name: string;
}

/**
 * 学员交流信息
 */
interface StudentMessage {
  content: string; //消息内容
  sectionId: number; // 小节id
  studentId: number; // 学员id
  studentMessageId: number; //	学员交流信息id
  studentName: string; // 学员姓名
  createTime: string; // 创建时间
}
