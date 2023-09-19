/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/sys/user/user.tsx
 * @Description: 用户管理
 */

import * as React from 'react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useSelector, Link, useDispatch } from 'umi';
import { Form, Table, Button, Space, Modal, message } from 'antd';
import type { FormInstance } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { selectAll } from '@/models/commonModel';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useAntdTable, useSize } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { SysServe, RoleServe } from '@/commonServe';
import type { Result, Item, SearchForm, ChangeUser, UserRoles } from './user.interface';
// import Search from './_part/Search';
import { hidePhone, hideIdCard } from '@/utils/util';
import Add from './_part/Add';
import MenuTree from './_part/MenuTree';
import { transformEnum, transformData } from '@/utils/util';
import { PageViewPro } from 'shevdc-component';

import './user.less';

const { CPageViewContent } = PageViewPro;

interface UserProps {}
const linkRrouters: LinkRrouter[] = [
  {
    name: '系统管理',
  },
  {
    name: '用户管理',
    address: '/sys/user',
  },
];
const defaultPageSize = 10;

/**
 * @description: 表格查询数据 ProTable 中的 request 属性
 * @param {*}
 * @return {*}
 */
const getTableData = async (p: {
  pageSize?: number;
  current?: number;
  keyword?: string;
}): Promise<Partial<RequestData<Item>>> => {
  const searchData = { ...p };
  delete searchData.pageSize;
  delete searchData.current;
  const res = await SysServe.post_findPage_user({
    params: transformData(searchData),
    pageSize: p.pageSize,
    pageNum: p.current,
  });
  return {
    data: res.code === 200 ? res.data.content : [],
    success: res.code === 200,
    total: res.data.totalSize,
  };
};

const User: React.FC<UserProps> = (props) => {
  const { commonState } = useSelector(selectAll);
  const [form] = Form.useForm<SearchForm>();
  const [selectItem, setselectItem] = useState<Item[]>(); // 选中的数据
  const [isShowAdd, setisShowAdd] = useState<boolean>(false);
  /**所有的角色 */
  const [allRole, setallRole] = useState<RoleObj[]>();
  const [changeUser, setchangeUser] = useState<Item>();
  const [deptArr, setdeptArr] = useState<DeptObj[]>([]);
  /**角色列表 */
  const [treeData, settreeData] = useState<UserRoles[]>();
  const [showPhoneId, setshowPhoneId] = useState<number[]>([]);
  // commonState.permissions['sys:role:edit']
  const { permissions, commonStaticInfo } = commonState; // 权限
  /**静态数据 职位 用户状态 */
  // const {  } = commonStaticInfo;
  /**创建table 并且分页、搜索联动 */
  const tableRef = useRef<ActionType>();
  /**搜索栏ref */
  const formRef = useRef<FormInstance<Item>>();
  /**
   * 重置搜索
   */
  const reset = useCallback(() => {
    if (tableRef.current && tableRef.current.reload) {
      tableRef.current.reload();
    }
  }, []);

  /**
   * @description: 点击编辑按钮
   * @param {Item} record
   * @return {*}
   */
  // const handleSetchangeUser = (record: Item) => {
  //   if (record && record.userRoles) {
  //     // 权限匹配
  //     const roleIdarr = record.userRoles.map((v) => {
  //       return v.roleId || 0;
  //     });
  //     console.log(roleIdarr);
  //     setchangeUser({
  //       ...record,
  //       userRoles: roleIdarr,
  //     });
  //   }
  // };
  /**
   * @description: 更新用户信息
   * @param {*} useCallback
   * @return {*}
   */
  const handleUpdateUser = useCallback(async (record: Item) => {
    setchangeUser(record);
    setisShowAdd(true);
    // const res = await SysServe.get_user_detail({
    //   sysUserId: record.id,
    // });
    // if (res.code === 200) {
    //   setchangeUser(res.data);
    //   setisShowAdd(true);
    // } else {
    //   message.error(res.msg);
    // }
  }, []);

  /**
   * @description: 点击新增
   * @param {*}
   * @return {*}
   */
  const handleAdd = () => {
    setchangeUser(undefined);
    setisShowAdd(true);
  };
  /**
   * @description: 显示手机号 全
   * @param {number} id
   * @return {*}
   */
  const handleShowphone = useCallback(
    (id: number) => {
      if (showPhoneId.includes(id)) {
        const index = showPhoneId.findIndex((_id) => _id === id);
        const d = [...showPhoneId];
        d.splice(index, 1);
        setshowPhoneId(d);
        // showPhoneId.splice(arr.findIndex(item => item.id === data.id), 1)
      } else {
        setshowPhoneId((prve) => {
          return [...prve, id];
        });
      }
    },
    [showPhoneId],
  );
  /**
   * @description: 删除用户
   * @param {type}
   * @return {type}
   */
  const handleDel = (record: Item[]) => {
    const data = record.map((v: Item) => {
      return {
        id: v.id,
      };
    });
    Modal.confirm({
      title: '确定删除用户吗？',
      onOk: () => {
        SysServe.post_delete_user(data).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            reset();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  };
  /**
   * @description: 重置密码
   * @param {*} useCallback
   * @return {*}
   */
  const handleResetPassword = useCallback((id: number) => {
    Modal.confirm({
      title: '确定重置密码吗？',
      onOk: () => {
        SysServe.post_user_reset_password({
          userId: id,
        }).then((res) => {
          if (res.code === 200) {
            Modal.success({
              content: `重置成功,密码：${res.data}`,
            });
            // reset();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  }, []);
  /**
   * @description: 用户的启停状态更新
   * @param {*} useCallback
   * @return {*}
   */
  const handleUpdateUserStatus = useCallback(
    (record: Item) => {
      Modal.confirm({
        title: `确定${record.status === 0 ? '启用' : '停用'}吗？`,
        onOk: () => {
          SysServe.get_user_update_user_status({
            id: record.id,
            operation: record.status === 0 ? 1 : 0,
          }).then((res) => {
            if (res.code === 200) {
              message.success('设置成功');
              reset();
            } else {
              message.error(res.msg);
            }
          });
        },
      });
    },
    [reset],
  );
  /**用户权限列表 */
  const userRolesValueEnum = useMemo(() => {
    if (treeData) {
      return treeData.map((item: UserRoles) => {
        return {
          value: item.id,
          label: item.roleName,
        };
      });
    }
    return [];
  }, [treeData]);

  const columns: ProColumns<Item>[] = useMemo(() => {
    return [
      {
        title: '序号',
        align: 'center',
        width: '70px',
        dataIndex: 'index',
        valueType: 'index',
      },

      {
        title: '账号',
        dataIndex: 'account',
        align: 'center',
        search: false,
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'userName',
      },
      {
        title: '手机',
        align: 'center',
        dataIndex: 'mobile',
        fieldProps: () => {
          return {
            maxLength: 11,
            placeholder: '请输入',
          };
        },
        render: (text, record, index) => {
          return (
            <Space>
              <span>
                {showPhoneId.includes(record.id as number)
                  ? record.mobile
                  : hidePhone(record.mobile || '')}
              </span>
              {record.mobile && (
                <EyeFilled onClick={() => handleShowphone(record.id || -1)}></EyeFilled>
              )}
            </Space>
          );
        },
      },

      {
        title: '角色',
        align: 'center',
        dataIndex: 'roleId',
        width: '170px',
        valueType: 'select',
        render: (text, _) => {
          return _.roleNames;
        },
        valueEnum: transformEnum(userRolesValueEnum),
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'status',
        // /**值的类型,会生成不同的渲染器 */
        valueType: 'select',
        /**值的枚举，会自动转化把值当成 key 来取出要显示的内容 */
        valueEnum: transformEnum(
          [
            { label: '停用', value: 0 },
            { label: '启用', value: 1 },
          ],
          {
            1: 'Success',
            0: 'Error',
          },
        ),
      },
      {
        title: '操作',
        dataIndex: 'orgSeq',
        align: 'center',
        width: '220px',
        search: false,
        render: (text, record, index) => {
          return (
            <Space>
              {permissions['sys:user:edit'] && (
                <Button
                  onClick={() => {
                    handleUpdateUser(record);
                    // setisShowAdd(true);
                    //  handleSetchangeUser(record);
                  }}
                  type="link"
                >
                  修改
                </Button>
              )}
              {permissions['sys:user:resetPassword'] && (
                <Button
                  onClick={() => {
                    handleResetPassword(record.id);
                    // setisShowAdd(true);
                    //  handleSetchangeUser(record);
                  }}
                  type="link"
                >
                  重置密码
                </Button>
              )}
              {permissions['sys:user:updateStatus'] && (
                <Button
                  type="link"
                  onClick={() => {
                    handleUpdateUserStatus(record);
                  }}
                  danger={record.status === 1}
                >
                  {record.status === 0 ? '启用' : '停用'}
                </Button>
              )}
            </Space>
          );
        },
      },
    ];
  }, [
    userRolesValueEnum,
    showPhoneId,
    handleShowphone,
    permissions,
    handleUpdateUser,
    handleResetPassword,
    handleUpdateUserStatus,
  ]);
  /**获取所有角色 */
  useEffect(() => {
    SysServe.get_querySystemRoleComboBox().then((res) => {
      if (res.code === 200) {
        settreeData(res.data);
      }
    });
  }, []);
  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
      <CPageViewContent>
        <ProTable
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
          }}
          scroll={{ x: 1024 }}
          /**table ref */
          actionRef={tableRef}
          /**查询表单的ref */
          formRef={formRef}
          /**数据查询 */
          request={getTableData}
          /** */
          columns={columns}
          /**搜索表单的配置 */
          search={{
            /**lab长度 */
            labelWidth: 'auto',
            /**配置查询表单的列数	 */
            span: {
              xs: 24,
              sm: 24,
              md: 8,
              lg: 8,
              xl: 6,
              xxl: 6,
            },
            /**自定义收起按钮 */
            collapseRender: () => {
              return <></>;
            },
            /**默认是否收起	 */
            defaultCollapsed: false,
            /**是否收起 */
            collapsed: false,
            /**自定义操作栏 */
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse(),
              <Button onClick={handleAdd} key="add">
                添加用户
              </Button>,
            ],
          }}
          /**table 工具栏，设为 false 时不显示 */
          // options={false}
          /**转化 moment 格式数据为特定类型，false 不做转化 */
          dateFormatter="string"
          /**搜索之前进行一些修改 */
          beforeSearchSubmit={(parame) => {
            return parame;
          }}
          bordered
          tableStyle={{
            padding: 0,
          }}
        ></ProTable>
      </CPageViewContent>
      <Add
        editData={changeUser}
        handleSearch={reset}
        treeData={treeData}
        // allRole={allRole}
        isShowAdd={isShowAdd}
        setisShowAdd={setisShowAdd}
        // deptArr={deptArr}
        commonState={commonState}
      />
    </PageViewPro>
  );
};

export default User;
