/*
 * @Author: 陈明烽
 * @Date: 2021-04-13 10:29:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-25 14:19:33
 * @FilePath: /evdata-exam/template/tep1/indexTep.js
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
import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { useSelector, Link, useDispatch } from 'umi';
import { Space, Button, message, Modal } from 'antd';
import type { FormInstance } from 'antd';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageViewPro } from 'shevdc-component';
import { transformData, transformEnum } from '@/utils/util';
import { BaseInfoServe } from '@/commonServe';
import type { Result, ItemObj, ItemObjDetil } from './${dirName}.interface';
import { selectAll } from '@/models/commonModel';
import Add from './_part/Add';
import Detail from './_part/Detail';
import styles from './${dirName}.less';


const { CPageViewContent } = PageViewPro;

interface ${titleCase(dirName)}Props {

}
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '企业信息',
    address: '/OrginfoManager/${dirName}',
  },
];
/**
 * @description: 表格查询数据 ProTable 中的 request 属性
 * @param {*}
 * @return {*}
 */
const getTableData = async (p: {
  pageSize?: number;
  current?: number;
  keyword?: string;
}): Promise<Partial<RequestData<ItemObj>>> => {
  const searchData = p;
  delete searchData.pageSize;
  delete searchData.current;
  const res = await BaseInfoServe.post_stationInfo_findPage({
    params: transformData(searchData),
    pageNum: p.current,
    pageSize: p.pageSize,
  });
  return {
    data: res.code === 200 && res.data ? res.data.content : [],
    success: res.code === 200,
    total: res.code === 200 && res.data ? res.data.totalSize : 0,
  };
};

const ${titleCase(dirName)}: FC<${titleCase(dirName)}Props> = (props) => {
  const { commonState } = useSelector(selectAll);
  /**加氢站列表 */
  const { commonStaticInfo, stationNameMap } = commonState;
  /**是否显示编辑或者新增 */
  const [isShowModal, setisShowModal] = useState<boolean>(false);
  /**编辑的内容 */
  const [editData, seteditData] = useState<ItemObj>();
  /**详情 */
  const [detailObj, setdetailObj] = useState<ItemObjDetil>();
  /**是否显示详情 */
  const [isShowDetail, setisShowDetail] = useState<boolean>(false);

  /**创建table 并且分页、搜索联动 */
  const tableRef = useRef<ActionType>();
  /**搜索栏ref */
  const formRef = useRef<FormInstance<ItemObj>>();
  /**
   * 重置搜索
   */
   const reset = useCallback(() => {
    if (tableRef.current && tableRef.current.reload) {
      tableRef.current.reload();
    }
  }, []);
  /**
   * 导出
   */
   const handleExport = useCallback(() => {}, []);
   const handleShowDetial = useCallback((record: ItemObj) => {
     // ajax请求
     setdetailObj(record);
     setisShowDetail(true);
   }, []);
  /**
   * @description: 删除
   * @param {*}
   * @return {*}
   */
   const handleDelete = useCallback((record: ItemObj) => {
    Modal.confirm({
      title: '确认删除吗？',
      onOk() {
        BaseInfoServe.post_stationInfo_delete([{ id: record.id }]).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            reset();
          } else {
            message.error(res.msg);
          }
        });
      },
      onCancel() {},
    });
  }, [reset]);
  /**
   * @description: 修改
   * @param {*}
   * @return {*}
   */
   const handleChangeData = useCallback((record: ItemObj) => {
    seteditData(record);
    setisShowModal(true);
  }, []);
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
  const columns: ProColumns<ItemObj>[] = useMemo(() => {
  return [
    {
      title: '序号',
      align: 'center',
      width: '70px',
      dataIndex: 'index',
      valueType: 'index',
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
      search: false,
    },
    {
      title: '所属加氢站',
      align: 'center',
      dataIndex: 'stationId',
      // /**值的类型,会生成不同的渲染器 */
      valueType: 'select',
      /**值的枚举，会自动转化把值当成 key 来取出要显示的内容 */
      valueEnum: transformEnum(stationNameMap),
    },
    {
      title: '运营时间',
      align: 'center',
      dataIndex: 'firstOperationTime',
      search: false,
    },
    {
      title: '联系人电话',
      align: 'center',
      dataIndex: 'contactPhone',
    },
    {
      title: '创建日期',
      align: 'center',
      valueType: 'dateRange',
      dataIndex: 'createTime',
      render: (text, record, _, action) => {
        return <span>{record.createTime}</span>;
      },
      search: {
        transform: (value) => {
          return {
            createTimeStart: value[0],
            createTimeEnd: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'orgSeq',
      align: 'center',
      search: false,
      width: '250px',
      render: (text, record, _, action) => {
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
  ]
},[handleChangeData,handleDelete,handleShowDetial])
  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
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
      <CPageViewContent>
        <ProTable
          rowKey="id"
          scroll={{ x: 1024 }}
          /**table ref */
          actionRef={tableRef}
          /**查询表单的ref */
          formRef={formRef}
          /**分页设置*/
          pagination={{
            defaultPageSize:10
          }}
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
            collapseRender:()=>{
              return <></>
            },
            /**默认是否收起	 */
            defaultCollapsed: false,
            /**是否收起 */
            collapsed:false,
            /**自定义操作栏 */
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse(),
              <Button onClick={handleExport} key="out">
                导出
              </Button>,
            ],
          }}
          /**table 工具栏，设为 false 时不显示 */
          options={false}
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
    </PageViewPro>
  );
};
export default ${titleCase(dirName)}


`;
module.exports = indexTep;
