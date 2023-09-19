/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/layout/common/_part/menuData.ts
 * @Description: 描述
 */
import type { MenuDataItem } from '@ant-design/pro-layout';

import {Icon} from 'shevdc-component'

interface Route extends MenuDataItem {
  routes?: Route[];
}
const menuData: Route[] = [
  {
    path: '/student/home',
    name: '首页',
    icon: Icon({type:'fa-home'}),
    children:[]
  },
  {
    path: '/student/training',
    name: '我的培训',
    icon: Icon({type:'fa-book'}),
    children:[]
  },
];




export default menuData;
