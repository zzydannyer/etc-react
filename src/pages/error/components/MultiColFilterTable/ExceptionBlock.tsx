import React from 'react';
import { Button } from 'antd';

interface Iprops {
  onRefresh?: () => void;
}

const ExceptionBlock: React.FC<Iprops> = ({ onRefresh = () => {} }) => {
  return (
    <div className="table-empty-block">
      <div className="result-image">
        <img alt="data empty" src="//img.alicdn.com/tfs/TB1_yJXFkL0gK0jSZFAXXcA9pXa-1112-758.png" />
      </div>
      <div className="result-title">
        <Button type="primary" onClick={onRefresh}>
          重新加载
        </Button>
      </div>
    </div>
  );
};

export default ExceptionBlock;
