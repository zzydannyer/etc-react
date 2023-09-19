/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/student/index.tsx
 * @Description: 学员端
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {} from 'antd';
import {useDispatch} from 'umi'

interface StudentProps {}
const Student: FC<StudentProps> = (props) => {
  const { children } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'commonState/getStudentInfo',
    });
  }, [dispatch]);
  return <>{children}</>;
};
export default Student;
