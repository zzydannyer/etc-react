import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Tree } from 'antd';

interface MenuTreeProps {
  isShowMenu: boolean;
}

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: <span style={{ color: '#1890ff' }}>sss</span>,
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];

const MenuTree: FC<MenuTreeProps> = (props) => {
  const { isShowMenu } = props;
  const onSelect = (selectedKeys: any, info: any) => {};

  const onCheck = (checkedKeys: any, info: any) => {};
  return (
    <Modal visible={isShowMenu}>
      <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={treeData}
      />
    </Modal>
  );
};

export default MenuTree;
