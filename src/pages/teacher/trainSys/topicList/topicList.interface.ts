import type { Moment } from 'moment';

export interface TopicOptionDetailVO {
  /**是否答案（0：否 1：是） */
  isAnswer: 0 | 1;
  /**是否学员提交的答案（0：否 1：是） */
  isStudentSubmit?: 0 | 1;
  /** 选项内容	*/
  optionContent: string;
  /** 选项id*/
  optionId: number | string;
}

export interface ItemObj {
  /** xxx*/
  id: number;
  /** 答案*/
  answer: string;
  /** 题干内容*/
  content: string;
  /** 课程分类*/
  courseType: number;
  /** 试题类型 1:单选题 2:多选题 3:判断题	*/
  type: number;
  /** 创建时间*/
  createTime: string;
  /** 题目选项信息 */
  topicOptionDetailVOList: TopicOptionDetailVO[];
}

export interface Result {
  total: number;
  list: ItemObj[];
}

export interface ItemObjDetil extends ItemObj {
  detial?: string;
}

export interface SaveTopicOptionDTO extends Omit<Partial<TopicOptionDetailVO>, 'isAnswer'> {
  isAnswer: boolean;
}

export interface AddItem extends Omit<Partial<ItemObj>, 'saveTopicOptionDTOList'> {
  saveTopicOptionDTOList: SaveTopicOptionDTO[];
}
