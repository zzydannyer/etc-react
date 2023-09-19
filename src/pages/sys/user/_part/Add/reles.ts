/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 13:01:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-22 14:49:51
 * @FilePath: /evdata-exam/src/pages/sys/user/_part/Add/reles.ts
 * @Description: 描述
 */
import type { Rule } from 'antd/lib/form';
import { email, zm, sz } from '@/utils/regular';
import { isMobileValidator, isPositiveInteger } from '@/utils/validate';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  account: [
    {
      type: 'string',
      required: true,
      message: '请输入账号',
    },
  ],
  userName: [
    {
      type: 'string',
      required: true,
      message: '请输入姓名',
    },
  ],
  password: [
    {
      type: 'string',
      required: true,
      message: '请输入密码',
    },
  ],
  email: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        if (value === '' || value === undefined) {
          return Promise.reject(new Error('请输入邮箱'));
        }
        if (!email.test(value)) {
          return Promise.reject(new Error('请输入正确的邮箱'));
        }
        return Promise.resolve();
      },
    },
  ],
  mobile: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        return isMobileValidator(_, value, '手机号');
      },
    },
  ],
  idNumber: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        return isPositiveInteger(_, value, '证件号码');
      },
    },
  ],
  status: [
    {
      type: 'number',
      required: true,
      message: '请选择状态',
    },
  ],
  stationId: [
    {
      type: 'number',
      required: true,
      message: '请选择站点',
    },
  ],
  job: [
    {
      type: 'number',
      required: true,
      message: '请选择职务',
    },
  ],
  entryDate: [
    {
      type: 'object',
      required: true,
      message: '请选择职务',
    },
  ],
  roleIdList: [
    {
      type: 'array',
      required: true,
      message: '请选择角色',
    },
  ],
};
