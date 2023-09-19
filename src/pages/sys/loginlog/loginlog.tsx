/*
 * @Author: xzk
 * @Date: 2020-10-19 13:32:56
 * @LastEditTime: 2021-07-01 11:07:32
 * @LastEditors: Please set LastEditors
 * @Description: 登录日志
 * @FilePath: \evdata-exam\src\pages\sys\loginlog\loginlog.tsx
 */
import * as React from 'react';
import { useState, useEffect, useRef, useMemo, Key } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect, Link, useDispatch } from 'umi';
import { Form, Table, Button, Space, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';
import type { SysModelState } from '../model';
import './loginlog.less';
import { BaseTable, PageView } from 'shevdc-component';
import { useAntdTable, useSize } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { SysServe, RoleServe } from '@/commonServe';
import type { Result, Item, SearchForm } from './loginlog.interface';
import Search from './_part/Search';
import { transformData } from '@/utils/util';
import { isUndefined } from 'lodash';

interface DictProps extends IRouteComponentProps {
  commonState: CommonModelState;
}
const linkRrouters: LinkRrouter[] = [
  {
    name: '系统管理',
  },
  {
    name: '登录日志',
    address: '/sys/loginlog',
  },
];
const defaultPageSize = 10;
const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Params,
): Promise<Result> => {
  return SysServe.post_findpage_loginlog({
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
  const { commonState } = props;
  const [form] = Form.useForm<SearchForm>();

  const dispatch = useDispatch();
  // useAntdTable https://ahooks.js.org/zh-CN/hooks/table/use-antd-table
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize,
    form,
  });
  const { submit } = search;

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: '70px',
    },

    {
      title: '用户名',
      dataIndex: 'userName',
      align: 'center',
      width: '150px',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: '100px',
    },
    {
      title: 'IP',
      align: 'center',
      dataIndex: 'ip',
      width: '100px',
    },
    {
      title: '耗时',
      align: 'center',
      dataIndex: 'time',
      width: '80px',
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
  ];
  useEffect(() => {}, []);

  return (
    <PageView linkRrouters={linkRrouters} paddingTop={110} paddingBottom={10}>
      <div className="c-page-view-top">
        <Search commonState={commonState} form={form} {...search} />
      </div>
      <BaseTable columns={columns} rowKey="id" bordered {...tableProps} />
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
