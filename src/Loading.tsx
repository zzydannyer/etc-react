/*
 * @Author: 陈明烽
 * @FilePath: \evdata-exam\src\Loading.tsx
 * @Description:全局加载样式
 */
import React from 'react';
import { Spin } from 'antd';

export default () => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin />
    </div>
  );
};
