/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/addTrain.tsx
 * @Description: 创建培训
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { history } from 'umi';
import { PageViewPro } from 'shevdc-component';
import { Steps } from 'antd';
import './addTrain.less';

const { CPageViewContent } = PageViewPro;
const { Step } = Steps;
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '培训管理',
  },
  {
    name: '创建培训'
  },
];

interface AddTrainProps {}
const AddTrain: FC<AddTrainProps> = (props) => {
  const { children } = props;
  const { location } = history;
  const { pathname } = location;
  const current = useMemo(() => {
    if (pathname.includes('step1')) {
      return 0;
    }
    if (pathname.includes('step2')) {
      return 1;
    }
    if (pathname.includes('step3')) {
      return 2;
    }
    if (pathname.includes('step4')) {
      return 3;
    }
    return 0;
  }, [pathname]);
  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
      <CPageViewContent className="add-train-padding">
        <Steps size='small' className="add-train-steps" current={current}>
          <Step title="基本信息" description="请填写培训基本信息" />
          <Step title="设计课程" description="设计课程信息" />
          <Step title="考试设置" description="进行考试设置" />
          <Step title="保存发布" description="保存或发布培训" />
        </Steps>
        <div>{children}</div>
      </CPageViewContent>
    </PageViewPro>
  );
};
export default AddTrain;
