/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/utils/util.ts
 * @Description: 描述
 */

/**
 * @description: 转换对象为数据，后台搜索接收数组
 * @param {Params} data
 * @return {*}
 */
export const transformData = (data: Params) => {
  const res: TransformData[] = [];
  for (const key in data) {
    if (data[key]) {
      res.push({
        name: key,
        value: data[key],
      });
    }
  }
  return res;
};
/**
 * @description: 后台的静态数据接口进行处理
 * @param {CommonStaticInfo} data
 * @return {*}
 */
export const transStaticInfo = (data: ComboBox[]) => {
  const obj: Params = {};
  data.map((item) => {
    const tIndex = item.type.indexOf('.');
    const str = item.type.substring(0, tIndex);

    obj[str.toUpperCase()] = item.comboBoxVOList;
  });
  return obj;
};
/**
 * @description: 把value转换成对应文字信息
 * @param {string} value
 * @param {CheckboxGroupOption} staticInfo
 * @return {*}
 */
export const findLabel = (staticInfo: CheckboxGroupOption[], value?: string | number) => {
  const info = staticInfo.find((item) => {
    // eslint-disable-next-line eqeqeq
    return item.value == value;
  });
  return info && info.label ? info.label : '';
};

type ValueEnum = Record<
  string,
  {
    text: string;
    status: number | string;
  }
>;

type StatusText = Record<string, TableItemStatusText>;

/**
 * @description: 把静态列表 转换成 ProTable 中的valueEnum数据
 * @param {CheckboxGroupOption} boxmap
 * @param {StatusText} statusText 不同的状态显示不用的颜色
 * @return {*}
 */
export const transformEnum = (boxmap: CheckboxGroupOption[], statusText?: StatusText) => {
  const res: ValueEnum = {};
  boxmap.map((v) => {
    res[v.value as string] = {
      text: v.label,
      status: statusText ? statusText[v.value as string] : v.value,
    };
  });
  return res;
};

/**获取大写的ABCD...Z */
export const getLetterArr = () => {
  const letterArr = [];
  for (let i = 65, j = 0; i < 91; i += 1, j += 1) {
    letterArr[j] = String.fromCharCode(i);
  }
  return letterArr;
};

/**隐藏手机号 */
export const hidePhone = (phone: string) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};
/**隐藏身份证号 */
export const hideIdCard = (id: string) => {
  return id.replace(/^(.{4})(?:\d+)(.{2})$/, '$1*********$2');
};

/**关闭 标签 */
export const closePage = () => {
  if (
    navigator.userAgent.indexOf('Firefox') !== -1 ||
    navigator.userAgent.indexOf('Chrome') !== -1
  ) {
    window.location.href = 'about:blank';
    window.close();
  } else {
    window.opener = null;
    window.open('', '_self');
    window.close();
  }
};

/**阿拉伯数字转化为汉字 */
const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
const chnUnitChar = ['', '十', '百', '千'];

const SectionToChinese = (section: number) => {
  const ori = section;
  let strIns = '';
  let chnStr = '';
  let unitPos = 0;
  let zero = true;
  while (section > 0) {
    const v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos += 1;
    // eslint-disable-next-line no-param-reassign
    section = Math.floor(section / 10);
  }
  if (ori < 20) {
    chnStr = chnStr.replace('一十', '十');
  }
  return chnStr;
};

export const NumberToChinese = (num: number) => {
  let unitPos = 0;
  let strIns = '';
  let chnStr = '';
  let needZero = false;
  if (num === 0) {
    return chnNumChar[0];
  }
  while (num > 0) {
    const section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = SectionToChinese(section);
    strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = section < 1000 && section > 0;
    // eslint-disable-next-line no-param-reassign
    num = Math.floor(num / 10000);
    unitPos += 1;
  }
  return chnStr;
};

export const downLoadByUrl = (_url: string) => {
  const xhr = new XMLHttpRequest();
  //GET请求,请求路径url,async(是否异步)
  xhr.open('GET', _url, true);
  //设置请求头参数的方式,如果没有可忽略此行代码
  xhr.setRequestHeader('token', window.localStorage.getItem('token') || '');
  //设置响应类型为 blob
  xhr.responseType = 'blob';
  //关键部分
  // eslint-disable-next-line func-names
  xhr.onload = function (e) {
    //如果请求执行成功
    if (this.status === 200) {
      const blob = this.response;
      // const filename = '我是文件名.xxx'; //如123.xls
      const a = document.createElement('a');

      blob.type = 'application/octet-stream';
      //创键临时url对象
      const url = URL.createObjectURL(blob);

      a.href = url;
      // a.download = filename;
      a.click();
      //释放之前创建的URL对象
      window.URL.revokeObjectURL(url);
    }
  };
  //发送请求
  xhr.send();
};
