import type { Rule, RuleObject } from 'antd/lib/form';
import { email, zm, sz } from './regular';

/**
 * @description: 统一的正则校验
 * @param {any} value 输入的value
 * @param {RegExp} reg 正则规则
 * @param {string} msg 提示文本
 * @return {*}
 */
export const validator = (_: RuleObject, value: any, reg: RegExp, msg: string) => {
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg}`));
  }
  if (value && !reg.test(value)) {
    return Promise.reject(new Error(`请输入正确${msg}`));
  }
  return Promise.resolve();
};
/**
 * @description: 校验邮箱
 * @param {any} value
 * @return {*}
 */
export const isEmailValidator = (_: RuleObject, value: any) => {
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error('请输入邮箱'));
  }
  if (value && !email.test(value)) {
    return Promise.reject(new Error('请输入正确的邮箱'));
  }
  return Promise.resolve();
};
/**
 * @description: 校验中文
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isChinese(_: RuleObject, value: any, msg?: string) {
  const reg = /^[\u4e00-\u9fa5]+$/;
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg}`));
  }
  if (value && !reg.test(value)) {
    return Promise.reject(new Error(`请输入中文`));
  }
  return Promise.resolve();
}
/**
 * @description: 数字且小数点后最多保留两位
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isNum2(_: RuleObject, value: any, msg?: string) {
  const reg = /^\d+(.\d{1,2})?$/;
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg}`));
  }
  if (value && value && !reg.test(value)) {
    return Promise.reject(new Error(`只能数字且小数点后最多保留两位`));
  }
  return Promise.resolve();
}
/**
 * @description: 社会统一信用代码
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isProductCompanyNumber(_: RuleObject, value: any, msg?: string) {
  const reg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g;
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg || '社会统一信用代码'}`));
  }
  if (value && !reg.test(value)) {
    return Promise.reject(new Error(`请输入正确的社会统一信用代码`));
  }
  return Promise.resolve();
}

/**
 * @description: 车牌号
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isLicensePlate(_: RuleObject, value: any, msg?: string) {
  const reg =
    /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{5}[A-Z0-9挂学警港澳]{1})$/;

  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg || '车牌号'}`));
  }
  if (value && !reg.test(value)) {
    return Promise.reject(new Error(`请输入正确的车牌号`));
  }
  return Promise.resolve();
}
/**
 * @description: 身份证号
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isPositiveInteger(_: RuleObject, value: any, msg?: string) {
  const reg =
    /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg || '身份证号'}`));
  }
  if (value && !reg.test(value)) {
    return Promise.reject(new Error(`请输入正确的身份证号`));
  }
  return Promise.resolve();
}

/**
 * @description: 手机号
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isMobileValidator(_: RuleObject, value: any, msg?: string) {
  const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg || '手机号'}`));
  }
  if (value && !reg.test(value)) {
    return Promise.reject(new Error(`请输入正确的手机号`));
  }
  return Promise.resolve();
}

/**
 * @description: 驾照号
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isDriveCode(_: RuleObject, value: any) {
  const reg =
    /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;

  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${'驾照号'}`));
  }

  if (value && !reg.test(value)) {
    return Promise.reject(new Error(`请输入正确的驾照号`));
  }
  return Promise.resolve();
}

/**
 * @description: 手机号或者座机
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isMobileOrLandlineValidator(_: RuleObject, value: any, msg?: string) {
  const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
  const landlineReg = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/;
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg || '手机号'}`));
  }
  if (value && !reg.test(value) && !landlineReg.test(value)) {
    return Promise.reject(new Error(`请输入正确的${msg}`));
  }
  return Promise.resolve();
}
/**
 * @description: 密码强度，长度6-18位  字符串类型：数字 英文 特殊符号且必须包含数字及英文
 * @param {any} value
 * @param {string} msg
 * @return {*}
 */
export function isPasswordValidator(_: RuleObject, value: any, msg?: string) {
  const reg = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/;
  if ((value === '' || value === undefined) && _.required) {
    return Promise.reject(new Error(`请输入${msg || '密码'}`));
  }
  if (value && !reg.test(value)) {
    return Promise.reject(new Error(`密码为长度6-18位，必须包含数字及英文 `));
  }
  return Promise.resolve();
}
