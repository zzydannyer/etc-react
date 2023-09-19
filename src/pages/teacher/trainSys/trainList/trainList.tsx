/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/trainList/trainList.tsx
 * @Description: 培训列表
 */

import * as React from 'react';
import type { Key, FC } from 'react';
import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { useSelector, Link, useDispatch, history } from 'umi';
import { Space, Button, message, Modal, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageViewPro } from 'shevdc-component';
import { transformData, transformEnum } from '@/utils/util';
import { TrainInfoServe } from '@/commonServe';
import { selectAll } from '@/models/commonModel';

import styles from './trainList.less';

const { CPageViewContent } = PageViewPro;

interface TrainlistProps {}
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '培训管理',
  },
  {
    name: '培训列表',
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
}): Promise<Partial<RequestData<TrainListInfo>>> => {
  const res = await TrainInfoServe.post_find_page({
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

const Trainlist: FC<TrainlistProps> = (props) => {
  const { commonState } = useSelector(selectAll);
  /**加氢站列表 */
  const { commonStaticInfo, permissions } = commonState;
  const { T_TRAIN_INFO } = commonStaticInfo;
  /**是否显示编辑或者新增 */
  const [isShowModal, setisShowModal] = useState<boolean>(false);
  /**编辑的内容 */
  const [editData, seteditData] = useState<TrainListInfo>();
  /**详情 */
  const [detailObj, setdetailObj] = useState<TrainDetial>();
  /**是否显示详情 */
  const [isShowDetail, setisShowDetail] = useState<boolean>(false);

  /**创建table 并且分页、搜索联动 */
  const tableRef = useRef<ActionType>();
  /**搜索栏ref */
  const formRef = useRef<FormInstance<TrainListInfo>>();
  /**
   * 重置搜索
   */
  const reset = useCallback(() => {
    if (tableRef.current && tableRef.current.reload) {
      tableRef.current.reload();
    }
  }, []);

  // const

  /**
   * 导出
   */
  const handleExport = useCallback(() => {}, []);
  const handleShowDetial = useCallback((record: TrainListInfo) => {
    // ajax请求
    //  setdetailObj(record);
    setisShowDetail(true);
  }, []);
  /**
   * @description: 删除
   * @param {*}
   * @return {*}
   */
  const handleDelete = useCallback(
    (record: TrainListInfo) => {
      Modal.confirm({
        title: '确认删除吗？',
        onOk() {
          TrainInfoServe.post_delete([record.id]).then((res) => {
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
   * @description: 新增
   * @param {*}
   * @return {*}
   */
  const handleAdd = () => {
    history.push({ pathname: '/teacher/trainSys/addTrain/step1' });
  };
  /**
   * @description: 发布
   * @param {*}
   * @return {*}
   */
  const handlePublish = useCallback((id: number) => {
    Modal.confirm({
      title: '确定发布吗？',
      onOk: () => {
        TrainInfoServe.post_publish({ id }).then((res) => {
          if (res.code === 200) {
            message.success('发布成功');
            formRef.current?.submit();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  }, []);
  /**
   * @description: 修改
   * @param {*}
   * @return {*}
   */
  const handleChangeData = useCallback((record: TrainListInfo) => {
    history.push({
      pathname: '/teacher/trainSys/addTrain/step1',
      query: {
        id: record.id.toString(),
      },
    });
  }, []);
  /**
   * @description: 取消发布
   * @param {*} useCallback
   * @return {*}
   */
  const handleCancelPublish = useCallback((id: number) => {
    let current = '';
    Modal.confirm({
      title: '取消发布原因',
      icon: <></>,
      content: (
        <>
          <Input
            onChange={(e) => {
              current = e.target.value;
            }}
            maxLength={80}
            placeholder="请输入取消发布原因"
          ></Input>
        </>
      ),
      onOk: () => {
        if (current.length === 0) {
          message.error('请输入取消发布原因');
          return Promise.reject(new Error('请输入取消发布原因'));
        }
        TrainInfoServe.post_cancel_publish({ id, cancelReason: current }).then((res) => {
          if (res.code === 200) {
            message.success('取消发布成功');
            formRef.current?.submit();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
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
  const columns: ProColumns<TrainListInfo>[] = useMemo(() => {
    return [
      {
        title: '序号',
        align: 'center',
        width: '70px',
        dataIndex: 'index',
        valueType: 'index',
      },
      {
        title: '培训名称',
        dataIndex: 'name',
        align: 'center',
        width: '200px',
        render: (text, record, _, action) => {
          return (
            <Button
              href={`/teacher/trainSys/trainDetial?id=${record.id}`}
              target="_blank"
              type="link"
            >
              {record.name}
            </Button>
          );
        },
      },
      {
        title: '起止时间',
        align: 'center',
        valueType: 'dateRange',
        dataIndex: 'endTime',
        render: (text, record, _, action) => {
          return (
            <span>
              {record.startTime} ~ {record.endTime}
            </span>
          );
        },
        search: {
          transform: (value) => {
            return {
              startTime: value[0],
              endTime: value[1],
            };
          },
        },
      },
      {
        title: '参加人数',
        align: 'center',
        dataIndex: 'joinNumber',
        search: false,
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'status',
        // /**值的类型,会生成不同的渲染器 */
        valueType: 'select',
        /**值的枚举，会自动转化把值当成 key 来取出要显示的内容 */
        valueEnum: transformEnum(T_TRAIN_INFO),
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
              {/* 只有未发布的培训可以被删除 */}
              {record.status === 0 && (
                <>
                  {permissions['business:train:edit'] && (
                    <Button onClick={() => handleChangeData(record)} type="link">
                      编辑
                    </Button>
                  )}

                  {permissions['business:train:delete'] && (
                    <Button onClick={() => handleDelete(record)} type="link">
                      删除
                    </Button>
                  )}
                  {permissions['business:train:publish'] && (
                    <Button onClick={() => handlePublish(record.id)} type="link">
                      发布
                    </Button>
                  )}
                </>
              )}
              {record.status === 4 && (
                <>
                  {permissions['business:train:delete'] && (
                    <Button onClick={() => handleDelete(record)} type="link">
                      删除
                    </Button>
                  )}
                </>
              )}
              {
                // 如果培训未到开始时间，则可以取消发布。
                record.status === 1 && permissions['business:train:cancel'] && (
                  <Button onClick={() => handleCancelPublish(record.id)} type="link">
                    取消发布
                  </Button>
                )
              }
            </Space>
          );
        },
      },
    ];
  }, [
    handleChangeData,
    handleDelete,
    handlePublish,
    T_TRAIN_INFO,
    handleCancelPublish,
    permissions,
  ]);
  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
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
            optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
          }}
          toolBarRender={() => [
            permissions['business:train:add'] ? (
              <Button key="3" onClick={handleAdd} type="primary">
                <PlusOutlined />
                新增培训
              </Button>
            ) : null,
          ]}
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
    </PageViewPro>
  );
};
export default Trainlist;
