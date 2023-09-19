/*
 * @Author: 陈明烽
 * @Date: 2021-04-07 09:00:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-25 16:16:35
 * @FilePath: /evdata-exam/src/typings/sys.d.ts
 * @Description: 描述
 */
interface DeptObj {
  name?: string | null;
  parentName?: string | null;
  id?: string;
  orderNum?: number;
  parentId?: string | null;
  children?: DeptObj[];
}
