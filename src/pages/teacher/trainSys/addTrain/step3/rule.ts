import type { Rule } from 'antd/lib/form';
import { isEmailValidator, isMobileValidator } from '@/utils/validate';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  examPaperId: [
    {
      type: 'number',
      required: true,
      message: '请选择试卷',
    },
  ],
  passingScore: [
    {
      type: 'number',
      required: true,
      message: '请输入及格分数',
    },
  ],
  maxExamTimes: [
    {
      type: 'number',
      required: true,
      message: '请输入可考次数',
    },
  ],
  answerTime: [
    {
      type: 'number',
      required: true,
      message: '请输入答题时间',
    },
  ],
  notice: [
    {
      type: 'string',
      required: true,
      message: '请输入考试须知',
    },
  ],
};
