/*
 * @Author: 陈明烽
 * @FilePath: \evdata-exam\src\pages\layout\common\_part\HistoryRouter.tsx
 * @Description: 描述
 */
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useLocation, history, useDispatch } from 'umi';
import { Tag, Tabs, Affix, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './HistoryRouter.less';

interface HistoryRouterProps {
  historyRoute: HistoryRoute[];
}

const { TabPane } = Tabs;

const HistoryRouter: FC<HistoryRouterProps> = (props) => {
  const { historyRoute } = props;
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (typeof targetKey === 'string') {
      dispatch({
        type: 'commonState/saveHistoryRoute',
        payload: {
          type: 'remove',
          data: [targetKey],
        },
      });
    }
  };
  /**
   * @description: 点击tab 跳转页面
   * @param {type}
   * @return {type}
   */
  const onChange = (activeKey: string) => {
    history.push(activeKey);
  };

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          dispatch({
            type: 'commonState/saveHistoryRoute',
            payload: {
              type: 'removeAll',
            },
          });
          history.replace('/');
        }}
        key="1"
      >
        关闭全部接口
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="history-router">
      <div className="history-router-back">
        <Tabs
          className="history-router-tabs"
          type="editable-card"
          size="small"
          activeKey={pathname}
          hideAdd={true}
          onEdit={onEdit}
          onChange={onChange}
          tabBarExtraContent={
            historyRoute.length > 1 ? (
              <Dropdown className="dropdown" overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                  <DownOutlined />
                </a>
              </Dropdown>
            ) : null
          }
        >
          {historyRoute &&
            historyRoute.map((item, index) => {
              return (
                <TabPane
                  className="history-router-tab"
                  closable={true}
                  tab={item.title}
                  key={item.key}
                ></TabPane>
              );
            })}
        </Tabs>
      </div>
    </div>
  );
};
export default HistoryRouter;
