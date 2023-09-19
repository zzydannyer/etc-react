/*
 * @Author: xzk cmf
 * @Date: 2020-10-21 13:21:04
 * @LastEditTime: 2021-09-08 11:14:53
 * @LastEditors: Please set LastEditors
 * @Description: 菜单管理
 * @FilePath: /evdata-exam/src/pages/sys/menu/menu.tsx
 */
import * as React from 'react';
import { useState, useEffect, useRef, useMemo, Key } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect, Link, useDispatch } from 'umi';
import { Form, Table, Button, Space, Modal, message, Tag } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';
import type { SysModelState } from '../model';
import './menu.less';
import { BaseTable, PageView } from 'shevdc-component';
import { Icon } from 'shevdc-component';
import { useAntdTable, useSize } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { SysServe } from '@/commonServe';
import type { Result, Item, SearchForm, treeInterface } from './menu.interface';
import Search from './_part/Search';
import Add from './_part/Add';
import { transformData } from '@/utils/util';
import { result } from 'lodash';

interface UserProps extends IRouteComponentProps {
  commonState: CommonModelState;
  SysModelState: SysModelState;
}
const linkRrouters: LinkRrouter[] = [
  {
    name: '系统管理',
  },
  {
    name: '菜单管理',
    address: '/sys/menu',
  },
];
const defaultPageSize = 10;
const typeList = ['目录', '菜单', '按钮'];

const getChildTree = (list: Item[]) => {
  const tree: treeInterface[] = [];
  list.map((item: Item) => {
    if (item.name !== '首页') {
      tree.push({
        title: item.name,
        key: item.id,
        children: getChildTree(item.children),
      });
    }
  });
  return tree;
};
// let menuTreeList: Item[] = [];
const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Params,
): Promise<Result> => {
  return SysServe.get_findPage_menu({
    // pageSize,
    // pageNum: current,
    // params: transformData(formData),
  }).then((res) => {
    if (res.code === 200) {
      return {
        total: res.data.length,
        list: res.data,
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
  const [form] = Form.useForm<SearchForm>();
  // const [selectItem, setselectItem] = useState<Item[]>(); // 选中的数据
  const [isShowAdd, setisShowAdd] = useState<boolean>(false);
  const dispatch = useDispatch();
  // useAntdTable https://ahooks.js.org/zh-CN/hooks/table/use-antd-table
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize,
    form,
  });
  const { permissions } = commonState; // 权限
  const { dataSource } = tableProps;

  const { submit } = search;
  const tableRef = useRef<HTMLDivElement>(null);

  const [changeMenu, setChangeMenu] = useState<Item>();
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
      title: '确定删除吗？',
      onOk: () => {
        SysServe.post_delete_menu(data).then((res) => {
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
  const columns: ColumnsType<Item> = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      width: '170px',
    },
    {
      title: '图标',
      align: 'center',
      dataIndex: 'icon',
      width: '70px',
      render: (text: string, record: Item, index: number) => {
        if (record.icon) {
          return <Icon type={record.icon} />;
        }
        return <Space></Space>;
      },
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'type',
      width: '100px',
      render: (text: string, record: Item, index: number) => {
        let color = '';
        if (record.type === 0) {
          color = 'blue';
        }
        if (record.type === 1) {
          color = 'green';
        }
        if (record.type === 2) {
          color = 'default';
        }
        return (
          <Space>
            <Tag color={color}>{typeList[record.type]}</Tag>
          </Space>
        );
      },
    },
    {
      title: '上级菜单',
      align: 'center',
      dataIndex: 'parentName',
      width: '150px',
    },
    {
      title: '菜单URL',
      align: 'center',
      dataIndex: 'url',
      width: '170px',
    },
    {
      title: '授权标识',
      align: 'center',
      dataIndex: 'perms',
      width: '180px',
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'orderNum',
      width: '150px',
    },

    {
      title: '操作',
      dataIndex: 'orgSeq',
      align: 'center',
      width: '220px',
      render: (text: string, record: Item, index: number) => {
        return (
          <Space>
            {permissions['sys:menu:edit'] && (
              <Button
                type="primary"
                onClick={() => {
                  setisShowAdd(true);
                  setChangeMenu(record);
                }}
              >
                编辑
              </Button>
            )}
            {permissions['sys:menu:delete'] && (
              <Button
                onClick={() => {
                  handleDel([record]);
                }}
                danger
              >
                删除
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  // const renderType = (type: number) => {
  //   if (type === 0) {
  //     return;
  //   }
  //   return typeList[type];
  // };

  /**
   * @description: 添加
   * @param {*}
   * @return {*}
   */
  const handleAdd = () => {
    setChangeMenu(undefined);
    setisShowAdd(true);
  };
  const [checkStrictly, setCheckStrictly] = React.useState(false);

  return (
    <PageView linkRrouters={linkRrouters} paddingTop={110} paddingBottom={10}>
      {/* <div>{menuTree}</div> */}
      <div className="c-page-view-top">
        <Search
          commonState={commonState}
          setisShowAdd={setisShowAdd}
          form={form}
          handleAdd={handleAdd}
          {...search}
        />
      </div>
      <BaseTable columns={columns} rowKey="name" bordered {...tableProps} />
      <Add
        isShowAdd={isShowAdd}
        setisShowAdd={setisShowAdd}
        submit={submit}
        changeMenu={changeMenu}
        dataSource={dataSource}
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
