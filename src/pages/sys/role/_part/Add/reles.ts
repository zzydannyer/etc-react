import type { Rule } from 'antd/lib/form';
import { email, zm, sz } from '@/utils/regular';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  roleName: [
    {
      type: 'string',
      required: true,
      message: '请输入角色名',
    },
  ],
};
