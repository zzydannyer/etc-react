import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useSelector, history, Link } from 'umi';
import { Space, Radio } from 'antd';
import './index.less';

interface SingleProps {
  value?: string;
  onChange?: (value: string) => void;
  data: SubjectTopic;
  index: number; // 记录是第几小题
}
const Single: FC<SingleProps> = ({ value, onChange, data, index }) => {
  return (
    <div className="single-con fx-row fx-row-top">
      <div>
        <div className="title">{`${index}、${data.content} (${data.score}分)`}</div>
        <div className="option">
          <Radio.Group
            value={value}
            onChange={(e) => {
              if (onChange) {
                onChange(e.target.value as string);
              }
            }}
          >
            <Space direction="vertical">
              {data.topicOptionDetailVOList.map((v, i) => {
                return (
                  <Radio value={v.optionId} key={data.subjectTopicId + v.optionId}>
                  {v.optionId}  {v.optionContent}
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};
export default Single;
