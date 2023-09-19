const dirName = process.argv[2];
function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(' ');
  return string;
}
const ruleTep = `
import type { Rule } from 'antd/lib/form';
import {isEmailValidator,isMobileValidator} from '@/utils/validate'

type Rules = Record<string, Rule[]>;

export const rules: Rules = {
  stationName: [
    {
      type: 'string',
      required: true,
      message: '请输入加氢站名称',
    },
  ],
  stationSubName: [
    {
      type: 'string',
      required: true,
      message: '请输入加氢站简称',
    },
  ],
  stationType:[{

      type: 'number',
      required: true,
      message: '请选择加氢站类型',
    },
  ],
  stationNo: [
    {
      type: 'string',
      required: true,
      message: '请输入加氢站编号',
    },
  ],
  contact:[
    {
      type: 'string',
      required: true,
      message: '请输入加氢站编号',
    },
  ],
  province:[
    {
      type: 'string',
      required: true,
    }
  ],
  address:[
    {
      type: 'string',
      required: true,
      message: '请输入地址',
    }
  ],
  city:[
    {
      type: 'string',
      required: true,
      message: '请输入地址',
    }
  ],
  area:[
    {
      type: 'string',
      required: true,

    }
  ],

  firstOperationTime:[
    {
      type:'object',
      required: true,
      message: '请选择加氢站投入运营时间',
    },
  ],

  contactEmail: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        return isEmailValidator(_,value)
      },
    },
  ],
  contactPhone: [
    {
      type: 'string',
      required: true,
      validator: (_, value) => {
        return isMobileValidator(_,value)
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

`;
module.exports = ruleTep;
