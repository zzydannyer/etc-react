/*
 * @Author: 陈明烽
 * @Date: 2021-04-13 10:29:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-01 15:03:02
 * @FilePath: \evdata-exam\template\tep2\indexTep.js
 * @Description: 描述
 */
// 页面模版
const dirName = process.argv[2];
function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(' ');
  return string;
}
const indexTep = `
import * as React from 'react';
import type { Key, FC } from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { connect, Link, useDispatch } from 'umi';
import { Form, Table, Tag, Space, Button,message,Modal } from 'antd';
import moment from 'moment';
import type { ColumnsType } from 'antd/lib/table';
import { PageViewPro, BaseTable } from 'shevdc-component';
import { useAntdTable, useSize } from 'ahooks';
import { transformData } from '@/utils/util';
import { BaseInfoServe } from '@/commonServe';
import type { IRouteComponentProps} from 'umi';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import type { CommonModelState } from '@/models/commonModel.interface';
import type { Result, ItemObj, SearchForm,ItemObjDetil } from './${dirName}.interface';
import type { ${titleCase(dirName)}ModelState } from './model';
import Search from './_part/Search';
import Add from './_part/Add'
import Detail from './_part/Detail';

import './${dirName}.less';

const {CPageViewTop} = PageViewPro

interface ${titleCase(dirName)}Props extends IRouteComponentProps {
  commonState: CommonModelState;
  ${dirName}ModelState: ${titleCase(dirName)}ModelState;
}
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '企业信息',
    address: '/OrginfoManager/${dirName}',
  },
];
/**默认pageSize */
const defaultPageSize = 10;
/**搜索table数据 */
const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: SearchForm,
): Promise<Result> => {
  const params = {
    stationName: formData.stationName,
    stationSubName: formData.stationSubName,
    createTimeStart:
      formData.date && moment(formData.date[0]).format('YYYY-MM-DD'),
      createTimeEnd:
      formData.date && moment(formData.date[1]).format('YYYY-MM-DD'),
  };
  return BaseInfoServe.post_stationInfo_findPage({
    pageSize,
    pageNum: current,
    params: transformData(params),
  }).then(res => {
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

const ${titleCase(dirName)}: FC<${titleCase(dirName)}Props> = props => {

  const { commonState, ${dirName}ModelState } = props;
  /**是否显示编辑或者新增 */
  const [isShowModal, setisShowModal] = useState<boolean>(false);
  /**编辑的内容 */
  const [editData, seteditData] = useState<ItemObj>();
  /**详情 */
  const [detailObj, setdetailObj] = useState<ItemObjDetil>();
  /**是否显示详情 */
  const [isShowDetail, setisShowDetail] = useState<boolean>(false);
  /**搜索栏的表单 */
  const [form] = Form.useForm<SearchForm>();
  const dispatch = useDispatch();
  /**创建table 并且分页、搜索联动 */
  // useAntdTable https://ahooks.js.org/zh-CN/hooks/table/use-antd-table
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: defaultPageSize,
    form,
  });
  /**重置搜索 提交搜索 */
  const { reset, submit } = search;
  const handleShowDetial = (record: ItemObj) => {
    // ajax请求
    setdetailObj(record);
    setisShowDetail(true);
  };
  /**
   * @description: 删除
   * @param {*}
   * @return {*}
   */
  const handleDelete = (record: ItemObj) =>{
    Modal.confirm({
      title:'确认删除吗？',
      onOk() {
          BaseInfoServe.post_stationInfo_delete([{id:record.id}]).then(res =>{
            if(res.code === 200){
              message.success('删除成功')
              reset()
            }else{
              message.error(res.msg)
            }
          })
      },
      onCancel() {
        console.log('Cancel');
      },
    })

  }
  /**
   * @description: 修改
   * @param {*}
   * @return {*}
   */
  const handleChangeData = (record: ItemObj) =>{
    seteditData(record)
    setisShowModal(true)
  }
  /*
    重置编辑信息
  */
  useEffect(() => {
    if (!isShowModal) {
      seteditData(undefined);
    }
  }, [isShowModal]);
  /**
   * 表格信息
   */
  const columns: ColumnsType<ItemObj> = useMemo(()=>{
    return [
    {
      title: '序号',
      dataIndex: 'orgId',
      align: 'center',
      width: '70px',
      render: (text: string, record: ItemObj, index: number) => {
        return <Space>{index + 1}</Space>;
      },
    },
    {
      title: '加氢站名称',
      dataIndex: 'stationName',
      align: 'center',
      width: '200px',
    },
    {
      title: '加氢站简称',
      align: 'center',
      dataIndex: 'stationSubName',
    },
    {
      title: '运营时间',
      align: 'center',
      dataIndex: 'firstOperationTime',
    },
    {
      title: '联系人电话',
      align: 'center',
      dataIndex: 'contactPhone',

    },
    {
      title: '创建日期',
      align: 'center',

      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'orgSeq',
      align: 'center',
      width: '250px',
      render: (text: string, record: ItemObj, index: number) => {
        return (
          <Space>
            <Button onClick={() => handleChangeData(record)} type="link">
              修改
            </Button>
            <Button onClick={() => handleDelete(record)} type="link">
              删除
            </Button>
            <Button onClick={() => handleShowDetial(record)} type="link">
              设置区域
            </Button>
          </Space>
        );
      },
    },
  ];
},[])
  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={150} paddingBottom={10}>
    {/* 编辑或者新增 */}
      <Add
        isShowModal={isShowModal}
        editData={editData}
        setisShowModal={setisShowModal}
        reset={reset}
        commonState={commonState}
      ></Add>
      {/* 详情 */}
      <Detail
        isShowDetail={isShowDetail}
        setisShowDetail={setisShowDetail}
        detailObj={detailObj}
        commonState={commonState}
      ></Detail>
      {/* 搜索栏 */}
      <CPageViewTop>
        <Search
          commonState={commonState}
          form={form}
          {...search}
          setisShowModal={setisShowModal}
        />
      </CPageViewTop>
      {/* 表格信息 */}
      <BaseTable
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys: Key[], selectedRows: ItemObj[]) => {
            console.log(selectedRows);
          },
        }}
        rowKey="stationName"
        bordered
        {...tableProps}
      />
    </PageViewPro>
  );
};
interface StateMdoelType {
  commonState: CommonModelState;
  ${dirName}ModelState: ${titleCase(dirName)}ModelState;
}

export default connect(
  ({ commonState, ${dirName}ModelState }: StateMdoelType) => {
    return {
      commonState,
      ${dirName}ModelState,
    };
  },
)(${titleCase(dirName)});


`;
module.exports = indexTep;
