/*
 * @Author: xzk
 * @Date: 2020-10-19 13:32:56
 * @LastEditTime: 2021-07-01 13:49:53
 * @LastEditors: Please set LastEditors
 * @Description: 字典管理
 * @FilePath: \evdata-exam\src\pages\sys\dict\dict.tsx
 */
import * as React from 'react';
import type { Key } from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect, Link, useDispatch } from 'umi';
import { Form, Table, Button, Space, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';
import type { SysModelState } from '../model';
import './dict.less';
import { BaseTable, PageView } from 'shevdc-component';
import { useAntdTable, useSize } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { SysServe, RoleServe } from '@/commonServe';
import type { Result, Item, SearchForm } from './dict.interface';
import Search from './_part/Search';
import Add from './_part/Add';
import { transformData } from '@/utils/util';
import { isUndefined } from 'lodash';

interface DictProps extends IRouteComponentProps {
  commonState: CommonModelState;
  sysModelState: SysModelState;
}
const linkRrouters: LinkRrouter[] = [
  {
    name: '系统管理',
  },
  {
    name: '字典管理',
    address: '/sys/dict',
  },
];
const defaultPageSize = 10;
const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Params,
): Promise<Result> => {
  return SysServe.post_findpage_dict({
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

const User: React.FC<DictProps> = (props) => {
  const { commonState, sysModelState } = props;
  const [form] = Form.useForm<SearchForm>();
  const [selectItem, setselectItem] = useState<Item[]>(); // 选中的数据
  const [isShowAdd, setisShowAdd] = useState<boolean>(false);
  const [allRole, setallRole] = useState<RoleObj[]>();
  const [ChangeDict, setChangeDict] = useState<Item>();
  const { permissions } = commonState; // 权限
  const dispatch = useDispatch();
  // useAntdTable https://ahooks.js.org/zh-CN/hooks/table/use-antd-table
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize,
    form,
  });
  const { submit } = search;
  const tableRef = useRef<HTMLDivElement>(null);
  /**
   * @description: 窗口改变大小 更新table的大小
   * @param {type}
   * @return {type}
   */
  const tableSize: TableSize = useSize(tableRef);
  const scrollY = useMemo(() => {
    return tableSize.height ? tableSize.height - 115 : 200;
  }, [tableSize]);
  /**
   * @description: 关闭弹框 删除之前的编辑类容
   * @param {type}
   * @return {type}
   */
  useMemo(() => {
    if (!isShowAdd) {
      setChangeDict(undefined);
    }
  }, [isShowAdd]);

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
        SysServe.post_delete_dict(data).then((res) => {
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
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: '70px',
    },

    {
      title: '名称',
      dataIndex: 'label',
      align: 'center',
      width: '150px',
    },
    {
      title: '值',
      dataIndex: 'delFlag',
      align: 'center',
      width: '100px',
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'type',
      width: '80px',
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'sort',
      width: '80px',
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'description',
      width: '100px',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remarks',
      width: '100px',
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'createBy',
      width: '100px',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      width: '150px',
    },

    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      width: '220px',
      render: (text: string, record: Item, index: number) => {
        return (
          <Space>
            {permissions['sys:dict:edit'] && (
              <Button
                onClick={() => {
                  setisShowAdd(true);
                  setChangeDict(record);
                }}
                type="primary"
              >
                编辑
              </Button>
            )}
            {permissions['sys:dict:delete'] && (
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

  /**
   * @description: 点击新增
   * @param {*}
   * @return {*}
   */
  const handleAdd = () => {
    setChangeDict(undefined);
    setisShowAdd(true);
  };
  return (
    <PageView linkRrouters={linkRrouters} paddingTop={110} paddingBottom={10}>
      <div className="c-page-view-top">
        <Search commonState={commonState} handleAdd={handleAdd} form={form} {...search} />
      </div>
      <BaseTable
        columns={columns}
        soltNode={
          selectItem && selectItem.length > 0 ? (
            <Button
              onClick={() => {
                handleDel(selectItem);
              }}
              className="batch-delete"
              danger
            >
              批量删除
            </Button>
          ) : (
            ''
          )
        }
        rowSelection={{
          onChange: (selectedRowKeys: Key[], selectedRows: Item[]) => {
            setselectItem(selectedRows);
          },
        }}
        rowKey="id"
        bordered
        {...tableProps}
      ></BaseTable>
      <Add
        changeDict={ChangeDict}
        handleSearch={submit}
        allRole={allRole}
        isShowAdd={isShowAdd}
        setisShowAdd={setisShowAdd}
      />
    </PageView>
  );
};
interface StateMdoelType {
  commonState: CommonModelState;
  sysModelState: SysModelState;
}

export default connect(({ commonState, sysModelState }: StateMdoelType) => {
  return {
    commonState,
    sysModelState,
  };
})(User);
