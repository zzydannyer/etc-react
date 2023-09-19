/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 16:57:59
 * @LastEditors: 陈明烽
 * @LastEditTime: 2021-04-06 17:34:00
 * @FilePath: \evdata-exam\src\pages\sys\dept\_part\Add\rules.tsx
 * @Description: 新增组织
 */

import type { Rule } from 'antd/lib/form';
import { email, zm, sz } from '@/utils/regular';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  name: [
    {
      type: 'string',
      required: true,
      message: '请输入用户名',
    },
  ],
  parentId: [
    {
      type: 'number',
      required: true,
      message: '请选择上级机构',
    },
  ],
  orderNum: [
    {
      type: 'number',
      required: false,
    },
  ],
};
