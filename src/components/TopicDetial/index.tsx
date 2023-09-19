/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/components/TopicDetial/index.tsx
 * @Description: 试题详情
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Descriptions, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import {} from 'umi';
import {} from '@/commonServe';

interface TopicDetialProps {
  isShowTopic: boolean;
  setisShowTopic: (b: boolean) => void;
  topicDetial?: SubjectTopic;
}
const TopicDetial: FC<TopicDetialProps> = (props) => {
  const { topicDetial, isShowTopic, setisShowTopic } = props;
  const handleCancel = () => {
    setisShowTopic(false);
  };

  const columns: ColumnsType<TopicOptionDetail> = [
    {
      title: '选项',
      dataIndex: 'optionId',
      key: 'optionId',
      align: 'center',
      width: '50px',
    },
    {
      title: '选项内容',
      dataIndex: 'optionContent',
      key: 'optionContent',
      align: 'center',
      width: '150px',
    },
    {
      title: '是否答案',
      dataIndex: 'isAnswer',
      key: 'isAnswer',
      align: 'center',
      width: '100px',
      render: (value, _) => {
        return <>{_.isAnswer === 1 ? '是' : ''}</>;
      },
    },
  ];

  return (
    <>
      <Modal
        title={'试题详情'}
        visible={isShowTopic}
        onCancel={handleCancel}
        getContainer={false}
        forceRender
        maskClosable={false}
        width={560}
        footer={null}
      >
        <Descriptions labelStyle={{ width: '100px' }} column={1} size={'middle'}>
          <Descriptions.Item label="课程分类">{topicDetial?.courseTypeName}</Descriptions.Item>
          <Descriptions.Item label="题型">{topicDetial?.typeName}</Descriptions.Item>
          <Descriptions.Item label="题干内容">{topicDetial?.content}</Descriptions.Item>
          <Descriptions.Item label="选项">
            <Table
              columns={columns}
              rowKey="optionId"
              size="small"
              bordered
              pagination={false}
              dataSource={topicDetial?.topicOptionDetailVOList || []}
            >
              {' '}
            </Table>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};
export default TopicDetial;
