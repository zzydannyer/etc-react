/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step4/index.tsx
 * @Description: 完成
 */

import * as React from 'react';
import type { FC } from 'react';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { Result, Button } from 'antd';
import { useTimeout, useInterval } from 'ahooks';

interface Step4Props {}
const Step4: FC<Step4Props> = (props) => {
  const { location } = history;
  const { query } = location;
  /**倒计时 */
  const [s, sets] = useState<number>(6);
  const handelJump = () => {
    history.replace({
      pathname: '/teacher/trainSys/trainList',
    });
  };
  useInterval(() => {
    sets((prev) => {
      return prev - 1;
    });
  }, 1000);

  useEffect(() => {
    if (s < 1) {
      handelJump();
    }
  }, [s]);

  return (
    <>
      <Result
        status="success"
        title={
          query?.operation === '2'
            ? `恭喜您！培训已成功发布，系统正在通知培训学员`
            : '恭喜您！培训已成功保存'
        }
        subTitle={`${s}秒后自动跳转至培训列表`}
        extra={[
          <Button type="primary" onClick={handelJump} key="console">
            返回培训列表
          </Button>,
        ]}
      />
    </>
  );
};
export default Step4;
