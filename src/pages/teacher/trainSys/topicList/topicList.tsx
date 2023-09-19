/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/topicList/topicList.tsx
 * @Description: 题目列表
 */

import * as React from 'react';
import type { Key, FC } from 'react';
import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { useSelector, Link, useDispatch } from 'umi';
import type { DataNode } from 'rc-tree-select/lib/interface';
import { Space, Button, message, Modal, Upload, TreeSelect } from 'antd';
import type { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageViewPro } from 'shevdc-component';
import { transformData, transformEnum } from '@/utils/util';
import { TopicInfoServe, get_temp_url } from '@/commonServe';
import type { Result, ItemObj, ItemObjDetil } from './topicList.interface';
import { selectAll } from '@/models/commonModel';
import { TopicDetial } from '@/components';
import Add from './_part/Add';
import Detail from './_part/Detail';
import styles from './topicList.less';

const { CPageViewContent } = PageViewPro;

interface TopiclistProps {}
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '培训管理',
  },
  {
    name: '题目列表',
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
  const res = await TopicInfoServe.post_find_page({
    ...p,
    pageNum: p.current,
    pageSize: p.pageSize,
  });
  return {
    data: res.code === 200 && res.data ? res.data.list : [],
    success: res.code === 200,
    total: res.code === 200 && res.data ? res.data.total : 0,
  };
};

const Topiclist: FC<TopiclistProps> = (props) => {
  const { commonState } = useSelector(selectAll);
  /**加氢站列表 */
  const { commonStaticInfo, permissions } = commonState;

  const { T_TOPIC_INFO, T_COURSE_INFO } = commonStaticInfo;

  /**是否显示编辑或者新增 */
  const [isShowModal, setisShowModal] = useState<boolean>(false);
  /**编辑的内容 */
  const [editData, seteditData] = useState<ItemObj>();

  /**试题详情 */
  const [topicDetial, settopicDetial] = useState<SubjectTopic>();
  /**是否显示题目详情 */
  const [isShowTopic, setisShowTopic] = useState<boolean>(false);
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
  const handleShowDetial = useCallback((record: ItemObj) => {
    // ajax请求
    // setdetailObj(record);
    // setisShowDetail(true);
    TopicInfoServe.get_find_by_id({ id: record.id }).then((res) => {
      if (res.code === 200) {
        settopicDetial(res.data);
        setisShowTopic(true);
      } else {
        message.error(res.msg);
      }
    });
  }, []);
  /**
   * @description: 删除
   * @param {*}
   * @return {*}
   */
  const handleDelete = useCallback(
    (record: ItemObj) => {
      Modal.confirm({
        title: '确认删除吗？',
        onOk() {
          TopicInfoServe.post_delete([record.id]).then((res) => {
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
    },
    [reset],
  );
  /**
   * @description: 修改
   * @param {*}
   * @return {*}
   */
  const handleChangeData = useCallback((record: ItemObj) => {
    TopicInfoServe.get_find_by_id({ id: record.id }).then((res) => {
      if (res.code === 200) {
        seteditData(res.data);
        setisShowModal(true);
      } else {

         message.error(res.msg);
      }
    });
    // seteditData(record);
    // setisShowModal(true);
  }, []);

  /**新增题目 */
  const handleAdd = useCallback(() => {
    seteditData(undefined);
    setisShowModal(true);
  }, []);
  /**
   * @description: 导入模板
   * @param {UploadChangeParam} info
   * @return {*}
   */
  const handleChange = (info: UploadChangeParam) => {
    const list = info.fileList;
    const res = info.file.response;
    // setfileList(list);
    if (res) {
      if (res.code === 200) {
        message.success('导入成功');
        reset();
      } else {
        Modal.error({
          title:res.msg
        })
        // message.error(res.msg);
      }
    }
  };
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
        title: '题型',
        dataIndex: 'type',
        align: 'center',
        width: '200px',
        valueType: 'select',
        valueEnum: transformEnum(T_TOPIC_INFO),
      },
      {
        title: '课程分类',
        dataIndex: 'courseType',
        hideInTable: true,
        align: 'center',
        renderFormItem: (item, { type, defaultRender, value, onChange }, form) => {
          return (
            <>
              <TreeSelect
                value={value}
                onChange={onChange}
                treeData={T_COURSE_INFO as DataNode[]}
                placeholder="请选择课程分类"
                allowClear
              ></TreeSelect>
            </>
          );
        },
      },
      {
        title: '题干内容',
        align: 'center',
        dataIndex: 'content',
        width: '250px',
        fieldProps: {
          maxLength: 500,
        },
      },
      {
        title: '答案',
        align: 'center',
        dataIndex: 'answer',
        search: false,
        width: '100px',
        render: (text, record, index) => {
          if (record.type === 3) {
            return record.answer === 'B' ? '错' : '对';
          }
          return record.answer;
        },
      },
      {
        title: '创建日期',
        align: 'center',
        dataIndex: 'createTime',
        search: false,
        width: '150px',
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
              {permissions['business:topic:edit'] && (
                <Button onClick={() => handleChangeData(record)} type="link">
                  编辑
                </Button>
              )}
              {permissions['business:topic:delete'] && (
                <Button onClick={() => handleDelete(record)} type="link">
                  删除
                </Button>
              )}
              {permissions['business:topic:view'] && (
                <Button onClick={() => handleShowDetial(record)} type="link">
                  查看
                </Button>
              )}
            </Space>
          );
        },
      },
    ];
  }, [handleChangeData, handleDelete, handleShowDetial, T_COURSE_INFO, T_TOPIC_INFO, permissions]);

  const handleDown = () => {
    get_temp_url({ fileUrl: 'excel/template/试题导入模板.xlsx' }).then((res) => {
      window.open(res.data);
      // window.location.href=res.data
    });
  };

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
      {/* 试题详情 */}
      <TopicDetial
        isShowTopic={isShowTopic}
        setisShowTopic={setisShowTopic}
        topicDetial={topicDetial}
      ></TopicDetial>
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
            defaultPageSize: 10,
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
              // <Button onClick={handleExport} key="out">
              //   新增题目
              // </Button>,
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
          toolBarRender={() => [
            permissions['business:topic:add'] ? (
              <Button key="3" onClick={handleAdd} type="primary">
                <PlusOutlined />
                新增题目
              </Button>
            ) : null,
            permissions['business:topic:import'] ? (
              <Upload
                action="/evdata-ets-api/api/topicInfo/importExcel"
                accept=".xlsx"
                headers={{
                  token: window.localStorage.getItem('token') || '',
                }}
                // fileList={[]}
                showUploadList={false}
                onChange={(info) => handleChange(info)}
                maxCount={1}
                key="z"
              >
                <Button>导入</Button>
              </Upload>
            ) : null,
            permissions['business:topic:import'] ? (
              <Button onClick={() => handleDown()} key="6" type="link">
                下载导入模板
              </Button>
            ) : null,
          ]}
          bordered
          tableStyle={{
            padding: 0,
          }}
        ></ProTable>
      </CPageViewContent>
    </PageViewPro>
  );
};
export default Topiclist;
