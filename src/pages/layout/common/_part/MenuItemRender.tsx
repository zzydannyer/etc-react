/*
 * @Author: cmf
 * @Date: 2020-10-14 13:26:42
 * @LastEditTime: 2021-08-01 10:44:37
 * @LastEditors: Please set LastEditors
 * @Description: 渲染实际点击链接
 * @FilePath: \evdata-exam\src\pages\layout\common\_part\MenuItemRender.tsx
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout';
import type { Dispatch } from 'redux';
import type { History } from 'history';
import { Location } from 'history';

interface MenuItemRenderProps {
  item: MenuDataItem;
  dom: React.ReactNode;
  setPathname: (s: string) => void;
  history: History;
  dispatch: Dispatch;
}
const MenuItemRender: FC<MenuItemRenderProps> = (props) => {
  const { item, dom, setPathname, dispatch, history } = props;
  return (
    <a
      onClick={() => {
        setPathname(item.path || '/');
        const path = item.path ? item.path : '/';
        // if (item.pro_layout_parentKeys && item.pro_layout_parentKeys.length > 0) {
        //   path = item.pro_layout_parentKeys.join('') + path;
        // }
        // 添加路由历史
        dispatch({
          type: 'commonState/saveHistoryRoute',
          payload: {
            type: 'add',
            data: {
              title: item.name,
              key: path,
            },
          },
        });
        history.push(path);
      }}
    >
      {dom}
    </a>
  );
};
export default MenuItemRender;
