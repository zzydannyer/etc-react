/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/sys/role/_part/MenuTree/index.tsx
 * @Description: 菜单全是设置
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, Tree, message } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import { RoleServe } from '@/commonServe';
import {} from 'antd/lib/tree';

interface MenuTreeProps {
  isShowMenu: boolean;
  roleMenus?: NavTree[]; // 角色权限
  setisShowMenu: (b: boolean) => void;
  menuTreeList: NavTree[]; //所有的权限列表
  changeRole?: RoleObj; // 选中的角色
  submit: () => void;
}

type Key = string | number;

const MenuTree: FC<MenuTreeProps> = (props) => {
  const {
    isShowMenu,
    roleMenus,
    setisShowMenu,

    changeRole,
    submit,
  } = props;
  const [checkedKeys, setcheckedKeys] = useState<Key[]>([]);
  /**
   * @description: tree 的 child
   * @param {type}
   * @return {type}
   */
  const getChildTree = (_roleMenus: NavTree[], pid: number): DataNode[] => {
    const tree: DataNode[] = [];
    for (let i = 0; i < _roleMenus.length; i + 1) {
      if (_roleMenus[i].type === 1 || _roleMenus[i].type === 0) {
        if (_roleMenus[i].parentId === pid) {
          tree.push({
            title: _roleMenus[i].name,
            key: _roleMenus[i].id,
            children: getChildTree(_roleMenus, _roleMenus[i].id),
          });
        }
      }
    }
    return tree;
  };

  /**
   * @description: 获取tree结构
   * @param {type}
   * @return {type}
   */
  const computeTreeData2 = useCallback((menuTreeList: NavTree[]): DataNode[] => {
    const tree: DataNode[] = [];

    if (menuTreeList && menuTreeList.length > 0) {
      for (let i = 0; i < menuTreeList.length; i += 1) {
        const { children } = menuTreeList[i];
        if (menuTreeList[i].selectFlag) {
          setcheckedKeys((v) => {
            return [...new Set([...v, String(menuTreeList[i].id)])];
          });
        }
        if (children && children.length > 0) {
          tree.push({
            title: menuTreeList[i].name,
            key: String(menuTreeList[i].id),
            children: computeTreeData2(children),
          });
        } else {
          tree.push({
            title: menuTreeList[i].name,
            key: String(menuTreeList[i].id),
          });
        }
      }
    }

    return tree;
  }, []);
  /**
   * @description: 计算生成 tree
   * @param {type}
   * @return {type}
   */
  const treeData = useMemo(() => {
    if (roleMenus && roleMenus.length > 0) {
      return computeTreeData2(roleMenus);
    }
    return [];
  }, [computeTreeData2, roleMenus]);
  /**
   * @description: 触发选中节点
   * @param {type}
   * @return {type}
   */
  const onCheck = (
    _checkedKeys:
      | {
          checked: Key[];
          halfChecked: Key[];
        }
      | Key[],
    info: any,
  ) => {
    if (!Array.isArray(_checkedKeys)) {
      setcheckedKeys(_checkedKeys.checked);
    }
  };

  // /**
  //  * @description: 获取选中的tree节点
  //  * @param {type}
  //  * @return {type}
  //  */
  // useEffect(() => {
  //   if (roleMenus && roleMenus.length > 0) {
  //     let keys: string[] = [];
  //     for (let i = 0; i < roleMenus.length; i++) {
  //       keys.push(String(roleMenus[i].id));
  //     }
  //     setcheckedKeys(keys);
  //   } else {
  //     setcheckedKeys([]);
  //   }
  // }, [roleMenus]);
  /**
   * @description: 提交角色菜单设置
   * @param {type}
   * @return {type}
   */
  const onOkModal = () => {
    if (changeRole && changeRole.id) {
      RoleServe.post_save_role_menus({
        roleId: changeRole.id,
        menuIdList: [...new Set(checkedKeys)],
      }).then((res) => {
        if (res.code === 200) {
          message.success('操作成功');
          setcheckedKeys([]);
          setisShowMenu(false);
          submit();

        } else {
          message.error(res.msg);
        }
      });
    }
  };
  return (
    <Modal
      destroyOnClose={true}
      onCancel={() => {
        setcheckedKeys([]);
        setisShowMenu(false);
      }}
      onOk={onOkModal}
      title={`${changeRole ? changeRole.roleName : ''}菜单权限设置`}
      visible={isShowMenu}
    >
      {/* {JSON.stringify(checkedKeys)} */}
      <Tree
        defaultExpandParent={true}
        defaultExpandAll={true}
        checkStrictly={true}
        checkable
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        treeData={treeData}
      />
    </Modal>
  );
};

export default MenuTree;
