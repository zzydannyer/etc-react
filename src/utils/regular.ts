/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 13:01:15
 * @LastEditors: 陈明烽
 * @LastEditTime: 2021-04-08 10:54:54
 * @FilePath: \evdata-exam\src\utils\regular.ts
 * @Description: 正则
 */
// 邮箱
export const email =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// 数字、字母及下划线
export const zm = /^[a-zA-Z0-9_]+$/;

// 数字
export const sz = /^\d+$/;
