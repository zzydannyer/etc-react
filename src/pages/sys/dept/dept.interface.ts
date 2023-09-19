/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 16:57:59
 * @LastEditors: 陈明烽
 * @LastEditTime: 2021-04-07 09:01:34
 * @FilePath: \evdata-exam\src\pages\sys\dept\dept.interface.ts
 * @Description: 组织
 */

export interface Result {
  total: number;
  list: DeptObj[];
}

export interface SearchForm {
  name: string;
}
