/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/studentSys/studentList/_part/EditStudent/rule.ts
 * @Description: 描述
 */
import type { Rule } from 'antd/lib/form';
import { isEmailValidator, isMobileValidator, isPositiveInteger } from '@/utils/validate';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  company: [
    {
      required: true,
      type: 'string',
      message: '请输入单位名称',
    },
  ],
  name: [
    {
      required: true,
      type: 'string',
      message: '请输入姓名',
    },
  ],
  idCardNo: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        return isPositiveInteger(_, value);
      },
    },
  ],
  mobilePhone: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        return isMobileValidator(_, value);
      },
    },
  ],
};
