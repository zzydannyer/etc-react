/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/trainDetial/_part/ChatRecord/index.tsx
 * @Description: 学员交流
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAntdTable } from 'ahooks';
import type { ColumnsType } from 'antd/lib/table';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Form, Modal, Table } from 'antd';
import { hidePhone } from '@/utils/util';
import {} from 'umi';
import { TrainInfoServe } from '@/commonServe';

interface ChatRecordProps {
  isShowChatRecord: boolean;
  setisShowChatRecord: (b: boolean) => void;
  sectionId?: number;
}

interface Result {
  list: StudentMessage[];
  total: number;
}

const defaultPageSize = 10;

const getTableData = ({ current, pageSize }: PaginatedParams[0], p: Params) => {
  return TrainInfoServe.post_student_message_find_page({
    pageSize,
    pageNum: current,
    ...p,
  }).then((res) => {
    if (res.code === 200) {
      return {
        total: res.data.total || 0,
        list: res.data.list || [],
      };
    }
    return {
      total: 0,
      list: [],
    };
  });
};

const ChatRecord: FC<ChatRecordProps> = (props) => {
  const { isShowChatRecord, setisShowChatRecord, sectionId } = props;
  const [form] = Form.useForm();
  const { tableProps, search, run } = useAntdTable(getTableData, {
    defaultPageSize,
    form,
    manual: true,
  });
  useEffect(() => {
    if (sectionId) {
      run({ current: 1, pageSize: defaultPageSize }, { sectionId });
    }
  }, [sectionId, form, run]);

  const columns: ColumnsType<StudentMessage> = [
    {
      title: '发言时间（倒序排序）',
      dataIndex: 'createTime',
      align: 'center',
      width: '120px',
    },
    {
      title: '学员姓名',
      dataIndex: 'studentName',
      align: 'center',
      width: '120px',
    },
    // {
    //   title: '手机',
    //   dataIndex: 'id',
    //   align: 'center',
    //   width: '70px',
    // },
    {
      title: '内容',
      dataIndex: 'content',
      align: 'center',
      width: '240px',
    },
  ];

  // StudentMessage
  return (
    <Modal
      visible={isShowChatRecord}
      width="680px"
      title="学员交流记录"
      footer={false}
      onCancel={() => setisShowChatRecord(false)}
    >
      <Table rowKey="createTime" columns={columns} size="small" bordered {...tableProps}></Table>
    </Modal>
  );
};
export default ChatRecord;
