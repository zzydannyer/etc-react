import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useSelector, history, Link } from 'umi';
import { Checkbox } from 'antd';
import './index.less';

interface Option {
  label: string;
  value: string;
}
interface MultipleProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  data: SubjectTopic;
  index: number; // 记录是第几小题
}
const Multiple: FC<MultipleProps> = ({ value, onChange, data, index }) => {
  /**多选题选项 */
  const [options, setoptions] = useState<Option[]>();

  useEffect(() => {
    const arr: Option[] = [];
    data?.topicOptionDetailVOList?.map((v, i) => {
      arr.push({ label: `${v.optionId} ${v.optionContent}`, value: v.optionId });
    });
    setoptions(arr);
  }, [data?.topicOptionDetailVOList]);

  return (
    <div className="multiple-con fx-row">
      <div>
        <div className="title">{`${index}、${data.content} (${data.score}分)`}</div>
        <div className="option">
          <Checkbox.Group
            options={options}
            value={value}
            onChange={(checkedValues) => {
              if (onChange) {
                onChange(checkedValues as string[]);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Multiple;
