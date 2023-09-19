import type { FC } from 'react';
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Button, Space, Avatar } from 'antd';
import { useLocation, Link } from 'umi';
import './index.less';

interface HeaderProps {}
const Header: FC<HeaderProps> = (props) => {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;

  return (
    <div className="c-header">
      <div className="header-padding fx-row fx-row-space-between">
        <div className="left">
          <p className="title">机电设备招标专家培训系统</p>
        </div>

        <div className="right">
          <Space>
            <span className="username">Joel Lambert</span>
            <Avatar
              className="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
          </Space>
        </div>
      </div>
    </div>
  );
};
export default Header;
