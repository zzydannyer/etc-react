/*
 * @Author: 陈明烽
 * @FilePath: \evdata-exam\src\pages\back\index.tsx
 * @Description: 业务逻辑总分支 暂时没用
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

interface BackProps {}

const BackDiv = styled.div`
  height: 100%;
  width: 100%;
`;

const Back: FC<BackProps> = (props) => {
  const { children } = props;
  return <BackDiv>{children}</BackDiv>;
};
export default Back;
