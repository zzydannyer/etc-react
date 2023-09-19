import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useSelector, history, Link } from 'umi';
import { Radio } from 'antd';
import './index.less';

interface JudgeProps {
  value?: string;
  onChange?: (value: string) => void;
  data: SubjectTopic;
  index: number;
}
const Judge: FC<JudgeProps> = ({ value, onChange, data, index }) => {
  return (
    <div className="judge-con fx-row">
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
            {data.topicOptionDetailVOList.map((v, i) => {
              return (
                <Radio value={v.optionId} key={data.subjectTopicId + v.optionId}>
                  {v.optionContent}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};
export default Judge;
