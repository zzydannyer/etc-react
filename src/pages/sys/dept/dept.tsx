/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 16:57:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-08 08:47:02
 * @FilePath: \evdata-exam\src\pages\sys\dept\dept.tsx
 * @Description: 组织机构
 */

import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect, Link, useDispatch } from 'umi';
import { Form, Table, Tag, Space, Button, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';

import './dept.less';
import { PageView, BaseTable } from 'shevdc-component';
import { useAntdTable, useSize } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { SysServe } from '@/commonServe';
import type { Result, SearchForm } from './Dept.interface';
import Search from './_part/Search';
import Add from './_part/Add';

const ss = {
  code: 200,
  msg: null,
  data: [
    {
      id: 1,
      createBy: null,
      createById: null,
      createTime: null,
      lastUpdateBy: null,
      lastUpdateById: null,
      lastUpdateTime: null,
      delFlag: 0,
      name: 'A级部门',
      parentId: null,
      orderNum: 0,
      children: [
        {
          id: 2,
          createBy: null,
          createById: null,
          createTime: null,
          lastUpdateBy: null,
          lastUpdateById: null,
          lastUpdateTime: null,
          delFlag: 0,
          name: 'B级部门',
          parentId: 1,
          orderNum: 0,
          children: [],
          parentName: 'B级部门',
          level: 1,
        },
        {
          id: 4,
          createBy: null,
          createById: null,
          createTime: null,
          lastUpdateBy: null,
          lastUpdateById: null,
          lastUpdateTime: null,
          delFlag: 0,
          name: 'B2级部门',
          parentId: 1,
          orderNum: 0,
          children: [],
          parentName: 'B2级部门',
          level: 1,
        },
        {
          id: 6,
          createBy: null,
          createById: null,
          createTime: null,
          lastUpdateBy: null,
          lastUpdateById: null,
          lastUpdateTime: null,
          delFlag: 0,
          name: 'B级部门',
          parentId: 1,
          orderNum: 1,
          children: [],
          parentName: 'B级部门',
          level: 1,
        },
        {
          id: 7,
          createBy: null,
          createById: null,
          createTime: null,
          lastUpdateBy: null,
          lastUpdateById: null,
          lastUpdateTime: null,
          delFlag: 0,
          name: 'B级部门',
          parentId: 1,
          orderNum: 1,
          children: [],
          parentName: 'B级部门',
          level: 1,
        },
      ],
      parentName: null,
      level: 0,
    },
    {
      id: 3,
      createBy: null,
      createById: null,
      createTime: null,
      lastUpdateBy: null,
      lastUpdateById: null,
      lastUpdateTime: null,
      delFlag: 0,
      name: 'A2级部门',
      parentId: null,
      orderNum: 0,
      children: [
        {
          id: 5,
          createBy: null,
          createById: null,
          createTime: null,
          lastUpdateBy: null,
          lastUpdateById: null,
          lastUpdateTime: null,
          delFlag: 0,
          name: 'B2级部门',
          parentId: 3,
          orderNum: 0,
          children: [],
          parentName: 'B2级部门',
          level: 1,
        },
      ],
      parentName: null,
      level: 0,
    },
  ],
};
interface DeptProps extends IRouteComponentProps {
  commonState: CommonModelState;
}
const linkRrouters: LinkRrouter[] = [
  {
    name: '组织机构',
    address: '/OrginfoManager/Dept',
  },
];
const defaultPageSize = 10;
const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Params,
): Promise<Result> => {
  return SysServe.post_dept_find_tree().then((res) => {
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

const Dept: React.FC<DeptProps> = (props) => {
  const { commonState } = props;
  const [isShowModal, setisShowModal] = useState<boolean>(false);
  const [editData, seteditData] = useState<DeptObj | undefined>(undefined);
  const [form] = Form.useForm<SearchForm>();
  const dispatch = useDispatch();
  const { permissions } = commonState;
  // useAntdTable https://ahooks.js.org/zh-CN/hooks/table/use-antd-table
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize,
    form,
  });
  const { reset, submit } = search;
  const { dataSource } = tableProps;
  /*
    重置
  */
  useEffect(() => {
    if (!isShowModal) {
      seteditData(undefined);
    }
  }, [isShowModal]);
  /**
   * @description: 删除机构
   * @param {type}
   * @return {type}
   */
  const handleDel = (record: DeptObj[]) => {
    const data = record.map((v: DeptObj) => {
      return {
        id: v.id,
      };
    });
    Modal.confirm({
      title: '确定删除吗？',
      onOk: () => {
        SysServe.post_dept_delete(data).then((res) => {
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
  const columns: ColumnsType<DeptObj> = [
    // {
    //   title: '序号',
    //   dataIndex: 'orgId',
    //   align: 'center',
    //   width: '70px',
    //   render: (text: string, record: Item, index: number) => {
    //     return <Space>{index + 1}</Space>;
    //   },
    // },

    {
      title: '组织名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '上级机构',
      align: 'center',
      dataIndex: 'parentName',
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
      render: (text: string, record: DeptObj, index: number) => {
        return (
          <Space>
            {permissions['sys:menu:edit'] && (
              <Button
                type="primary"
                onClick={() => {
                  setisShowModal(true);
                  seteditData(record);
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

  return (
    <PageView linkRrouters={linkRrouters} paddingTop={150} paddingBottom={10}>
      <Add
        isShowModal={isShowModal}
        editData={editData}
        setisShowModal={setisShowModal}
        handleSearch={reset}
        dataSource={dataSource}
      ></Add>
      <div className="c-page-view-top">
        <Search commonState={commonState} form={form} {...search} setisShowModal={setisShowModal} />
      </div>
      {/* {JSON.stringify(tableProps)} */}
      <BaseTable columns={columns} rowKey="name" bordered {...tableProps} />
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
})(Dept);
