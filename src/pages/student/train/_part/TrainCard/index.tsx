import type { FC } from 'react';
import React, { useState, useEffect, useMemo } from 'react';
import { Popover, Table, message, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useLocation, Link, Route, Switch, history } from 'umi';
import type { MyTrainListInfo, ExamScore } from '../../index.interface';
import { StudentTrainInfoServe } from '@/commonServe';
import './index.less';
import subject from '@/assets/img/studentTrain/1.png';
import type { ColumnsType } from 'antd/lib/table';
import { useInterval } from 'ahooks';

interface TrainCardProps {
  list: MyTrainListInfo; // 我的培训列表信息
  EXAM_PASS: Record<string, string>;
  // studentTrainId: number;   // 从父组件获取到的学员培训记录id
}
const TrainCard: FC<TrainCardProps> = (props) => {
  const { list, EXAM_PASS } = props; // 我的培训列表
  /**查看成绩 */
  const [score, setscore] = useState<ExamScore[]>();

  const columns: ColumnsType<ExamScore> = useMemo(() => {
    return [
      {
        title: '考试时间',
        align: 'center',
        dataIndex: 'lastUpdateTime',
        key: 'lastUpdateTime',
      },
      {
        title: '考试成绩',
        align: 'center',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: '考试结果',
        align: 'center',
        dataIndex: 'isPass',
        key: 'isPass',
        render: (text, record) => {
          return <span>{text === 0 ? '不合格' : '合格'}</span>;
        },
      },
    ];
  }, []);

  const viewGrades = () => {
    StudentTrainInfoServe.exam_score({
      studentTrainId: list.studentTrainId, // 学员培训记录id
    }).then((res) => {
      if (res.code === 200) {
        setscore(res.data);
      }
    });
  };

  /**
   * 开始考试
   */
  const startExam = (surplusExamTimes: number, isStudyFinish: number, isExamPass: number) => {
    // if (surplusExamTimes <= 0) {
    //   message.info('考试次数已用完');
    // } else if (isStudyFinish === 0) {
    //   message.info('课程尚未学习完，不能考试');
    // } else if (isExamPass === 1) {
    //   message.info('考试已通过，不能再次考试');
    // } else {
    //   history.push(`/student/training/exam?id=${list.studentTrainId}`);
    // }
    history.push(`/student/training/exam?id=${list.studentTrainId}`);
  };

  const content = (
    <div style={{ height: '400px', overflow: 'auto' }}>
      <Table bordered dataSource={score} pagination={false} columns={columns} rowKey="id" />
    </div>
    //
  );
  return (
    <div className="trainCard ">
      <div className="train fx-row fx-row-center">

        <div className="introduce fx-row fx-row-space-between fx-row-center">
          <div className="left fx-row fx-row-left fx-row-center">
            <img className="image" src={subject} alt="" />
            <div className="con">
              <h1 className="title">{list?.trainName}</h1>
              <p className="time">
                培训起止时间： {list?.startTime} 至 {list?.endTime}
              </p>
              <div className="score">
                <span>试卷分数：{list.totalScore}分</span>
                <span className="passing-score">及格分数：{list.passingScore}分</span>
              </div>
              <div className="result fx-row fx-row-space-between">
                {/* 培训已开始，展示培训结果 */}
                {list.status > 1 && <p className="res">培训结果：{EXAM_PASS[list?.isExamPass]}</p>}
                {/* 培训已开始，展示查看成绩 */}
                {list.status > 1 && list.isStudyFinish === 1 && (
                  <Popover content={content} placement="bottom" trigger="click">
                    <a className="check" onClick={viewGrades}>
                      查看成绩
                    </a>
                  </Popover>
                )}

                {/* 当课程学习完成、有考试剩余次数、未通过考试、培训未截止、培训已开始 展示次数 */}
                {list.isStudyFinish === 1 &&
                  list.surplusExamTimes >= 0 &&
                  (list.isExamPass === 0 || list.isExamPass === -1) &&
                  list.status === 2 && (
                    <span className="exam">考试剩余次数：{list.surplusExamTimes}</span>
                  )}
              </div>
            </div>
          </div>
          <div className="toExam ">
            {/* 当前课程学习完成、有考试剩余次数、未通过考试、培训未截止、培训已开始 展示开始考试 */}
            {
              list.isStudyFinish === 1 &&
                list.surplusExamTimes > 0 &&
                list.isExamPass !==1 &&
                list.status === 2 &&
              <div
                className="btn fx-row fx-row-center fx-row-middle"
                onClick={() =>
                  startExam(list.surplusExamTimes, list.isStudyFinish, list.isExamPass)
                }
              >
                开始考试
              </div>
            }
            {/* 剩余考试次数为0、培训已开始，考试按钮置灰 考试未开始或者未通过 */}
            {list.surplusExamTimes === 0 && list.status === 2 && list.isExamPass !== 1 && (
              <div className="btn btn-default fx-row fx-row-center fx-row-middle">开始考试</div>
            )}
          </div>
          <div className="trainCard-txt">
            {list.status === 1 ? (
              <>暂未开始</>
            ) : (
              <Link to={`/student/training/detail?id=${list.studentTrainId}`} className="detail">
                查看详情
                <RightOutlined />
              </Link>
            )}
          </div>
          {/* <div className="right">
            {list.status === 1 ? (
              <>暂未开始</>
            ) : (
              <Link to={`/student/training/detail?id=${list.studentTrainId}`} className="detail">
                查看详情
                <RightOutlined />
              </Link>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default TrainCard;
