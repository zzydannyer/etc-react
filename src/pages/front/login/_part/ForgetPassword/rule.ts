/*
 * @Author: 陈明烽
 * @FilePath: \evdata-exam\src\pages\login\_part\ForgetPassword\rule.ts
 * @Description: 描述
 */

import type { Rule } from 'antd/lib/form';
import { isMobileValidator } from '@/utils/validate';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  phoneNumber: [
    {
      required: true,
      type: 'number',
      validator: (_, value) => {
        return isMobileValidator(_, value);
      },
    },
  ],
  sys: [
    {
      required: true,
      type: 'string',
      message: '请输入验证码',
    },
  ],
  password: [
    {
      required: true,
      type: 'string',
      message: '请输入密码',
    },
  ],
  password2: [
    {
      required: true,
      type: 'string',
      message: '请输入密码',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('两次密码输入不相同'));
      },
    }),
  ],
};
