/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step2/_part/AddCourse/rule.ts
 * @Description: 描述
 */
import type { Rule } from 'antd/lib/form';
import { isEmailValidator, isMobileValidator } from '@/utils/validate';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  name: [
    {
      type: 'string',
      required: true,
      message: '请输入培训名称',
    },
  ],
  courseType: [
    {
      type: 'number',
      required: true,
      message: '请选择课程分类',
    },
  ],
  studentIdList: [
    {
      type: 'array',
      required: true,
      message: '学员不能为空',
    },
  ],
  description: [
    {
      type: 'string',
      required: true,
      message: '请输入培训说明',
    },
  ],
};
