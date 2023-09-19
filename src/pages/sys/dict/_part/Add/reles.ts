import type { Rule } from 'antd/lib/form';
import { email, zm, sz } from '@/utils/regular';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  label: [
    {
      type: 'string',
      required: true,
      message: '请输入名称',
    },
  ],
  value: [
    {
      type: 'string',
      required: false,
      message: '请输入值',
    },
  ],
  type: [
    {
      type: 'string',
      required: false,
      message: '请输入类型',
    },
  ],
  // email: [
  //   {
  //     type: 'string',
  //     required: true,
  //     validator: (_, value) => {
  //       if (value === '' || value === undefined) {
  //         return Promise.reject('请输入邮箱');
  //       }
  //       if (!email.test(value)) {
  //         return Promise.reject('请输入正确的邮箱');
  //       }
  //       return Promise.resolve();
  //     },
  //   },
  // ],
  // mobile: [
  //   {
  //     type: 'string',
  //     required: true,
  //     validator: (_, value) => {
  //       if (value === '' || value === undefined) {
  //         return Promise.reject('请输入手机号');
  //       }
  //       if (value[0] !== '1' || value.length !== 11 || !sz.test(value)) {
  //         return Promise.reject('请输入正确的手机号');
  //       }
  //       return Promise.resolve();
  //     },
  //   },
  // ],
  // sex: [
  //   {
  //     type: 'string',
  //     required: true,
  //     message: '请选择性别',
  //   },
  // ],
  // userRoles: [
  //   {
  //     type: 'array',
  //     required: true,
  //     message: '请选择角色',
  //   },
  // ],
};
