/*
 * @Author: 关朝伟
 * @FilePath: /evdata-exam/src/components/AnswerRecord/answerRecord.tsx
 * @Description: 答题记录
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Space, message, Modal, Typography, Row, Col, Button, Tabs } from 'antd';
import type { ColumnsType } from 'antd/lib/table/interface';
import { StudentInfoServe, TrainInfoServe } from '@/commonServe';
import type { AnswerObj, subjectTopicVO } from './answerRecord.interface';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

interface AnswerProps {
  showAnswer: boolean;
  answerId: number | undefined;
  setShowAnswer: (s: boolean) => void;
}
const AnswerRecord: FC<AnswerProps> = (props) => {
  const { showAnswer, setShowAnswer, answerId } = props;
  /**答题记录 */
  const [data, setData] = useState<AnswerObj[]>([]);
  /**当前显示的答题记录 */
  const [currentRecord, setcurrentRecord] = useState<AnswerObj>();
  /**答题时间 */
  const createTimeList = useMemo(() => {
    return data.map((item) => {
      return item.createTime;
    });
  }, [data]);
  /**
   * @description: 获取答题记录
   * @param {*} useCallback
   * @return {*}
   */
  const getStuInfo = useCallback(async (id) => {
    const res = await TrainInfoServe.get_query_exam_answer_detail({ studentTrainId: id });
    if (res.code === 200) {
      setData(res.data || []);
      if (res.data && res.data.length > 0) {
        setcurrentRecord(res.data[0]);
      }
    } else {
      message.error(res.msg);
    }
  }, []);
  useEffect(() => {
    if (answerId) {
      getStuInfo(answerId);
    }
  }, [answerId, getStuInfo]);
  /**
   * @description: 处理提交操作
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    setShowAnswer(false);
  };
  /**
   * @description: 处理关闭操作
   * @param {*}
   * @return {*}
   */
  const handleCancle = () => {
    setShowAnswer(false);
  };
  /**
   * @description: 切换不同的时间
   * @param {*}
   * @return {*}
   */
  const handleChangeTime = (timeStr: string) => {
    const s: AnswerObj | undefined = data.find((item) => {
      return item.createTime === timeStr;
    });
    if (s) {
      setcurrentRecord(s);
    }
  };

  /** 表格主体 */
  const columns: ColumnsType<subjectTopicVO> = [
    {
      title: '序号',
      dataIndex: 'orgId',
      align: 'center',
      width: '70px',
      render: (text, record, index) => {
        return <Space>{index + 1}</Space>;
      },
    },
    {
      title: '题型',
      align: 'center',
      dataIndex: 'typeName',
      width: 80,
    },
    {
      title: '题干',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '正确答案',
      align: 'center',
      dataIndex: 'answer',
      width: 100,
    },
    {
      title: '学员答案',
      align: 'center',
      dataIndex: 'submitAnswer',
      width: 100,
    },
    {
      title: '是否正确',
      align: 'center',
      dataIndex: 'isTrue',
      width: 100,
      render: (text, record, index) => {
        if (record.isTrue === 0) {
          return (
            <div>
              <CloseOutlined />
            </div>
          );
        }
        return (
          <div>
            <CheckOutlined />
          </div>
        );
      },
    },
    {
      title: '得分',
      align: 'center',
      dataIndex: 'score',
      width: 60,
    },
  ];

  return (
    <Modal
      title="答题记录"
      visible={showAnswer}
      cancelButtonProps={{}}
      onOk={handleOk}
      onCancel={handleCancle}
      footer={false}
      width="810px"
    >
      {createTimeList.length > 0 ? (
        <Tabs defaultActiveKey="1" onChange={(timeStr) => handleChangeTime(timeStr)}>
          {createTimeList.map((item) => {
            return (
              <TabPane tab={item} key={item}>
                <div className="fx-row">
                  <div className="fx-1">考试时间: {currentRecord?.createTime}</div>
                  <div>考试成绩：{currentRecord?.score}</div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <div>考试结果：{currentRecord?.isPass === 1 ? '合格' : '不合格'}</div>
                </div>

                <Table columns={columns} dataSource={currentRecord?.subjectTopicVOList}></Table>
              </TabPane>
            );
          })}
        </Tabs>
      ) : (
        <>暂无答题记录</>
      )}
    </Modal>
  );
};
export default AnswerRecord;
