/*
 * @Author: your name
 * @Date: 2020-09-04 12:53:51
 * @LastEditTime: 2020-10-19 09:54:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \evdata-web-umi\src\layouts\base\index.tsx
 */
import React from 'react';
import { Layout } from 'antd';
import type { LayoutProps } from '../index';
import './index.less';

const { Footer, Content } = Layout;
const Base: React.FC<LayoutProps> = (props) => {
  const { children } = props;
  return (
    <Layout className="base-layout">
      <Content>{children}</Content>
    </Layout>
  );
};

export default Base;
