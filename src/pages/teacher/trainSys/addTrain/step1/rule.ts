/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step1/rule.ts
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
  trangeTime: [
    {
      type: 'array',
      required: true,
      message: '请选择培训起止时间',
    },
  ],
  // studentIdList: [
  //   {
  //     type: 'array',
  //     required: true,
  //     message: '学员不能为空',
  //   },
  // ],
  description: [
    {
      type: 'string',
      required: true,
      message: '请输入培训说明',
    },
  ],
};
