/*
 * @Author: xzk
 * @Date: 2020-10-19 13:32:56
 * @LastEditTime: 2021-07-01 11:07:14
 * @LastEditors: Please set LastEditors
 * @Description: 操作日志
 * @FilePath: \evdata-exam\src\pages\sys\log\log.tsx
 */
import * as React from 'react';
import { useState, useEffect, useRef, useMemo, Key } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect, Link, useDispatch } from 'umi';
import { Form, Table, Button, Space, Modal, message } from 'antd';
import classNames from 'classnames';
import type { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';
import type { SysModelState } from '../model';
import './log.less';
import { useAntdTable, useSize } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { SysServe, RoleServe } from '@/commonServe';
import type { Result, Item, SearchForm } from './log.interface';
import Search from './_part/Search';
import { transformData } from '@/utils/util';
import { isUndefined } from 'lodash';
import { BaseTable, PageView } from 'shevdc-component';

interface DictProps extends IRouteComponentProps {
  commonState: CommonModelState;
}
const linkRrouters: LinkRrouter[] = [
  {
    name: '系统管理',
  },
  {
    name: '操作日志',
    address: '/sys/log',
  },
];
const defaultPageSize = 10;
const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Params,
): Promise<Result> => {
  return SysServe.post_findpage_log({
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
  const { dataSource } = tableProps;

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
      width: '100px',
    },
    {
      title: '方法',
      dataIndex: 'method',
      align: 'center',
      width: '200px',
    },
    {
      title: '参数',
      dataIndex: 'params',
      align: 'center',
      width: '200px',
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
      dataIndex: 'lastUpdateTime',
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
