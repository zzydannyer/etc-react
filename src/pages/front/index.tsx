/*
 * @Author: 陈明烽
 * @FilePath: \evdata-exam\src\pages\front\index.tsx
 * @Description: 描述
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {} from 'antd';

interface FontProps {}
const Font: FC<FontProps> = (props) => {
  const { children } = props;
  return <>{children}</>;
};
export default Font;
