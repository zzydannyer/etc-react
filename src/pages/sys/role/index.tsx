/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/sys/role/index.tsx
 * @Description: 角色
 */

import * as React from 'react';
import { useState, useEffect, useRef, useMemo, Key } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect, Link, useDispatch } from 'umi';
import { Form, Table, Button, Space, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';

// import './User.less';
import { BaseTable, PageView } from 'shevdc-component';
import { useAntdTable, useSize } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { SysServe, RoleServe } from '@/commonServe';
import type { Result, SearchForm } from './role.interface';
import { ChangeRole } from './role.interface';
import Search from './_part/Search';
import Add from './_part/Add';
import MenuTree from './_part/MenuTree';
import { transformData } from '@/utils/util';

interface UserProps extends IRouteComponentProps {
  commonState: CommonModelState;
}
const linkRrouters: LinkRrouter[] = [
  {
    name: '系统管理',
  },
  {
    name: '角色管理',
  },
];
const defaultPageSize = 10;
const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Params,
): Promise<Result> => {
  return RoleServe.post_findPage({
    pageSize,
    pageNum: current,
    params: transformData(formData),
  }).then((res) => {
    if (res.code === 200) {
      return {
        total: res.data.totalSize,
        list: res.data.content,
      };
    }
    return {
      total: 0,
      list: [],
    };
  });
};

const User: React.FC<UserProps> = (props) => {
  const { commonState } = props;
  const [isShowAdd, setisShowAdd] = useState<boolean>(false);
  const [form] = Form.useForm<SearchForm>();
  const [changeRole, setchangeRole] = useState<RoleObj>();
  const dispatch = useDispatch();
  const [isShowMenu, setisShowMenu] = useState<boolean>(false);
  const [roleMenus, setroleMenus] = useState<NavTree[]>();
  const [roleId, setroleId] = useState<number>();
  // useAntdTable https://ahooks.js.org/zh-CN/hooks/table/use-antd-table
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize,
    form,
  });
  const { submit } = search;
  /**
   * @description: 点击编辑权限配置
   * @param {type}
   * @return {type}
   */
  const handleFindRoleMenus = (record: RoleObj) => {
    RoleServe.get_find_role_menus(record.id).then((res) => {
      if (res.code === 200) {
        setroleMenus(res.data);
        setchangeRole(record);
        setisShowMenu(true);
      } else {
        message.error(res.msg);
      }
    });
  };
  /**
   * @description: 删除用户
   * @param {type}
   * @return {type}
   */
  const handleDel = (record: RoleObj[]) => {
    const data = record.map((v: RoleObj) => {
      return {
        id: v.id,
      };
    });
    Modal.confirm({
      title: '确定删除角色吗？',
      onOk: () => {
        RoleServe.post_delete(data).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            submit();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  };
  /**
   * @description: 关闭弹框 删除之前的编辑类容
   * @param {type}
   * @return {type}
   */
  // useEffect(() => {
  //   if (!isShowAdd||!isShowMenu) {
  //     setchangeRole(undefined);
  //   }
  // }, [isShowAdd,isShowMenu]);
  const columns: ColumnsType<RoleObj> = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      width: '70px',
      render: (text, record, index) => {
        return <Space>{index + 1}</Space>;
      },
    },
    {
      title: '角色名',
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },

    {
      title: '操作',
      dataIndex: 'orgSeq',
      align: 'center',
      width: '250px',
      render: (text: string, record: RoleObj, index: number) => {
        return (
          <Space>
            {commonState.permissions['sys:role:edit'] && (
              <Button
                onClick={() => {
                  setisShowAdd(true);
                  setchangeRole(record);
                }}
                type="primary"
              >
                编辑
              </Button>
            )}
            {commonState.permissions['sys:role:delete'] && (
              <Button
                onClick={() => {
                  handleDel([record]);
                }}
                type="primary"
                danger
              >
                删除
              </Button>
            )}
            {commonState.permissions['sys:role:edit'] && (
              <Button
                onClick={() => {
                  handleFindRoleMenus(record);
                }}
              >
                权限配置
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'commonState/findNenuTree',
      });
    }
  }, [dispatch]);
  /**
   * @description: 点击新增
   * @param {*}
   * @return {*}
   */
  const handleAdd = () => {
    setchangeRole(undefined);
    setisShowAdd(true);
  };
  return (
    <PageView linkRrouters={linkRrouters} paddingTop={110} paddingBottom={10}>
      <div className="c-page-view-top">
        <Search commonState={commonState} handleAdd={handleAdd} form={form} {...search} />
      </div>
      <BaseTable columns={columns} rowKey="id" bordered {...tableProps} />
      <Add
        changeRole={changeRole}
        handleSearch={submit}
        isShowAdd={isShowAdd}
        setisShowAdd={setisShowAdd}
      />
      <MenuTree
        submit={submit}
        changeRole={changeRole}
        menuTreeList={commonState.menuTree}
        roleMenus={roleMenus}
        setisShowMenu={setisShowMenu}
        isShowMenu={isShowMenu}
      />
    </PageView>
  );
};
interface StateMdoelType {
  commonState: CommonModelState;
}

export default connect(({ commonState }: StateMdoelType) => {
  return {
    commonState,
  };
})(User);
