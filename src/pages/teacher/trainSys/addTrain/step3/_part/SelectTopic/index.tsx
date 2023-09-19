/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step3/_part/SelectTopic/index.tsx
 * @Description:选择小题
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Modal, Form, Input, Select, message, TreeSelect, Button } from 'antd';
import type { DataNode } from 'rc-tree-select/lib/interface';
import type { FormInstance } from 'antd';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { ExamPaperInfoServe } from '@/commonServe';
import ProTable from '@ant-design/pro-table';
import { TopicInfoServe } from '@/commonServe';
import { transformEnum } from '@/utils/util';

interface SelectTopicProps {
  /**大题id */
  selectTopicSubjectInfo?: Subject;
  /**试题类型 1:单选题 2:多选题 3:判断题*/
  T_TOPIC_INFO: CheckboxGroupOption[];

  T_COURSE_INFO: CheckboxGroupOption[];
  /** */
  isShowSelectTopic: boolean;
  /** */
  setisShowSelectTopic: (b: boolean) => void;
  /**刷新 */
  handleGetSubjectVOList: (id?: number) => void;
}
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
}): Promise<Partial<RequestData<SubjectTopic>>> => {
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

const { Option } = Select;

const SelectTopic: FC<SelectTopicProps> = (props) => {
  const {
    selectTopicSubjectInfo,
    T_TOPIC_INFO,
    T_COURSE_INFO,
    isShowSelectTopic,
    handleGetSubjectVOList,
    setisShowSelectTopic,
  } = props;
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);
  /**试题类型 */
  const [topicType, settopicType] = useState<number>();
  /**选中的 */
  const [selectedItems, setselectedItems] = useState<number[]>([]);
  /**创建table 并且分页、搜索联动 */
  const tableRef = useRef<ActionType>();
  /**搜索栏ref */
  const formRef = useRef<FormInstance<SubjectTopic>>();
  /**
   * 重置搜索
   */
  const reset = useCallback(() => {
    if (tableRef.current && tableRef.current.reload) {
      tableRef.current.reload();
    }
  }, []);

  const selectedRowKeys = useMemo(() => {
    return selectedItems;
  }, [selectedItems]);

  const handleCancel = () => {
    setselectedItems([]);
    setisShowSelectTopic(false);
  };
  /**初始化 赋值 */
  useEffect(() => {
    if (isShowSelectTopic) {
      /**赋值题型 */
      settopicType(selectTopicSubjectInfo?.topicType);
      /**设置选中项目 */
      setselectedItems(
        (selectTopicSubjectInfo?.subjectTopicVOList &&
          selectTopicSubjectInfo?.subjectTopicVOList.map((item) => {
            return item.id;
          })) ||
          [],
      );
    }
  }, [isShowSelectTopic, reset, selectTopicSubjectInfo]);
  /**题型被赋值后 搜索 */
  useEffect(() => {
    formRef.current?.submit();
  }, [topicType]);
  /**
   * @description: 提交
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    ExamPaperInfoServe.post_save_subject_topic({
      subjectId: selectTopicSubjectInfo?.subjectId,
      topicIdList: selectedItems,
    }).then((res) => {
      if (res.code === 200) {
        message.success('设置成功');
        handleGetSubjectVOList();
        handleCancel();
      } else {
        message.error(res.msg);
      }
    });
  };
  const columns: ProColumns<SubjectTopic>[] = [
    {
      title: '题型',
      dataIndex: 'type',
      align: 'center',
      width: '80px',
      search: false,
      valueType: 'select',
      valueEnum: transformEnum(T_TOPIC_INFO),
    },
    {
      title: '题干内容',
      align: 'center',
      dataIndex: 'content',
      width: '150px',
    },
    {
      title: '答案',
      align: 'center',
      dataIndex: 'answer',
      search: false,
      width: '50px',
      render: (value, row) => {
        if (row.type === 3) {
          return row.answer === 'B' ? '错' : '对';
        }
        return row.answer;
      },
    },
    {
      title: '课程分类',
      dataIndex: 'courseType',
      // hideInTable: true,
      align: 'center',
      render:(text,_)=>{
        return _.courseTypeName
      },
      width: '120px',
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
      // valueEnum:[]
    },
  ];
  return (
    <>
      <Modal
        title={'选择题目'}
        visible={isShowSelectTopic}
        onCancel={handleCancel}
        onOk={handleOk}
        getContainer={false}
        forceRender
        confirmLoading={confirmLoading}
        maskClosable={false}
        destroyOnClose={true}
        width={890}
      >
        {/* {JSON.stringify(selectTopicSubjectInfo)} */}
        <ProTable
          rowSelection={{
            fixed: true,
            selectedRowKeys,
            // 手动触发选择
            onSelect: (record, selected, _selectedModelRows, nativeEvent) => {
              if (selected) {
                setselectedItems((prve) => {
                  const s = [...prve];
                  s.push(record.id);
                  return Array.from(new Set(s));
                });
              } else {
                setselectedItems((prve) => {
                  const list = prve.filter((id) => {
                    return id !== record.id;
                  });
                  return list;
                });
              }
            },
            onSelectNone: () => {
              console.log('onSelectNone');
            },
            // 手动触发全选
            onSelectAll: (selected, _selectedModelRows, changeRows) => {
              // /**全选 */
              if (selected) {
                setselectedItems((prve) => {
                  const vehicleModelSeqList = changeRows.map((item) => {
                    return item.id;
                  });
                  const s = [...prve].concat(vehicleModelSeqList);
                  return Array.from(new Set(s));
                });
              } else {
                const vehicleModelSeqList = changeRows.map((item) => {
                  return item.id;
                });
                setselectedItems((prve) => {
                  const list = prve.filter((id) => {
                    return !vehicleModelSeqList.includes(id);
                  });
                  return list;
                });
              }
            },
          }}
          /** */
          tableAlertOptionRender={() => {
            return (
              <Button
                onClick={() => {
                  setselectedItems([]);
                }}
                type="link"
              >
                全部取消
              </Button>
            );
          }}
          rowKey="id"
          // scroll={{ x: 560 }}
          /**table ref */
          actionRef={tableRef}
          /**查询表单的ref */
          formRef={formRef}
          /**分页设置*/
          pagination={{
            defaultPageSize: 3,
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
          /**table 工具栏，设为 false 时不显示 */
          options={false}
          /**转化 moment 格式数据为特定类型，false 不做转化 */
          dateFormatter="string"
          /**搜索之前进行一些修改 */
          beforeSearchSubmit={(parame) => {
            return { ...parame, type: topicType };
          }}
          bordered
          tableStyle={{
            padding: 0,
          }}
        ></ProTable>
      </Modal>
    </>
  );
};
export default SelectTopic;
