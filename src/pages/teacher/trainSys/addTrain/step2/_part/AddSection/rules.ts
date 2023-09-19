/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step2/_part/AddSection/rules.ts
 * @Description: 描述
 */

import type { Rule } from 'antd/lib/form';
import {} from '@/utils/validate';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  name: [
    {
      type: 'string',
      required: true,
      message: '请输入小节名称',
    },
  ],
  videoId: [
    {
      type: 'string',
      required: true,
      message: '请选择视频',
    },
  ],
  description: [
    {
      type: 'string',
      required: true,
      message: '请输入介绍',
    },
  ],
  coursewareUrl: [
    {
      type: 'string',
      required: true,
      message: '请输入上传课件',
    },
  ],
};
