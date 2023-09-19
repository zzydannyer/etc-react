/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 13:01:15
 * @LastEditors: 陈明烽
 * @LastEditTime: 2021-04-09 16:09:56
 * @FilePath: \evdata-exam\src\pages\sys\menu\_part\Add\reles.ts
 * @Description: 描述
 */
import type { Rule } from 'antd/lib/form';
import { email, zm } from '@/utils/regular';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  name: [
    {
      type: 'string',
      required: true,
      message: '请输入菜单名称',
    },
  ],
  orderNum: [
    {
      type: 'number',
      required: true,
      message: '请输入排序编号',
    },
  ],
  url: [
    {
      type: 'string',
      required: true,
      message: '请输入菜单路由',
    },
  ],
};
