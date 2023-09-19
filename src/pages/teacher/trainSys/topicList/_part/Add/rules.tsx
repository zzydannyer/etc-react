import type { Rule } from 'antd/lib/form';
import { isEmailValidator, isMobileValidator } from '@/utils/validate';

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  stationName: [
    {
      type: 'string',
      required: true,
      message: '请输入加氢站名称',
    },
  ],
  type: [
    {
      type: 'number',
      required: true,
      message: '请选择题型',
    },
  ],
  courseType: [
    {
      type: 'number',
      required: true,
      message: '请选择课程分类',
    },
  ],
  content: [
    {
      type: 'string',
      required: true,
      message: '请输入题干内容',
    },
  ],
  province: [
    {
      type: 'string',
      required: true,
    },
  ],
  address: [
    {
      type: 'string',
      required: true,
      message: '请输入地址',
    },
  ],
  city: [
    {
      type: 'string',
      required: true,
      message: '请输入地址',
    },
  ],
  area: [
    {
      type: 'string',
      required: true,
    },
  ],

  firstOperationTime: [
    {
      type: 'object',
      required: true,
      message: '请选择加氢站投入运营时间',
    },
  ],

  contactEmail: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        return isEmailValidator(_, value);
      },
    },
  ],
  contactPhone: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        return isMobileValidator(_, value);
      },
    },
  ],
  businessLicenseUrl: [
    {
      type: 'string',
      required: true,
      message: '请上传营业执照',
    },
  ],
};
