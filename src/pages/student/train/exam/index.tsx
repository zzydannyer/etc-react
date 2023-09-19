import type { FC } from 'react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, history, Link } from 'umi';
import { Button, Form, message, Modal, Descriptions } from 'antd';

import { StudentTrainInfoServe } from '@/commonServe';
import { useFormGetFieldsValue } from '@/hooks';
import moment from 'moment';
import type { Moment } from 'moment';
import Single from '../_part/Single';
import Multiple from '../_part/Multiple';
import Judge from '../_part/Judge';
import flag from '@/assets/img/studentTrain/flag.png';
import markFlag from '@/assets/img/studentTrain/markFlag.png';
import { useInterval } from 'ahooks';
import { Prompt } from 'react-router-dom';
import { PageViewPro } from 'shevdc-component';
import { NumberToChinese } from '@/utils/util';
import type { ExamScore } from '../index.interface';
import './index.less';

const { CPageViewContent, CPageViewTop } = PageViewPro;

/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '我的培训',
    address: '/student/training',
  },
  {
    name: '我的考试',
  },
];

interface ExamProps {}

type ExamForm = Record<string, string | string[]>;

const Exam: FC<ExamProps> = (props) => {
  const { location } = history;
  const { pathname, query } = location;
  /**考试试卷详情 */
  const [examPaper, setexamPaper] = useState<ExamPaperDetail>();
  /**考试时间 */
  const [answerTime, setanswerTime] = useState<string>();
  /**考试是否结束，即倒计时是否结束 */
  const [bool, setbool] = useState<boolean>(false);
  /**是否给题目做标记*/
  const [mark, setmark] = useState<Record<number, boolean>>({});
  /**倒计时 */
  const [totalTime, settotalTime] = useState<number>();
  /**是否已提交试卷 */
  const [isSubmit, setisSubmit] = useState<boolean>(false);
  /**是否显示考试结果 */
  const [isShowRes, setisShowRes] = useState<boolean>(false);
  /**考试结果 */
  const [examScore, setexamScore] = useState<{ name: string; isPass: 0 | 1; score: number }>();
  /**初始化开始考试时间 */
  const [initCurrentTime, setinitCurrentTime] = useState<Moment>();

  const [form] = Form.useForm<ExamForm>();

  const { formValues, onValuesChange, resetForm, upDateFormValues } = useFormGetFieldsValue(form);

  /**
   * 手动提交试卷
   */
  const onFinish = () => {
    const submitTopicAnswerDTOList: { answer: string; topicId: number }[] = [];
    let hasAllSub = true;
    for (const i in formValues) {
      if (!formValues[i]) {
        hasAllSub = false;
      }
      let answer = formValues[i];
      if (Array.isArray(formValues[i])) {
        answer = (formValues[i] as string[]).join('');
      }
      submitTopicAnswerDTOList.push({
        answer: answer as string,
        topicId: Number(i),
      });
    }
    if (!hasAllSub) {
      Modal.error({ title: '请完成所有试题' });
      return;
    }
    const params = {
      studentTrainId: query?.id,
      submitTopicAnswerDTOList,
    };
    Modal.confirm({
      title: '确认提交试卷吗？',
      onOk: () => {
        // 调用接口提交试卷
        StudentTrainInfoServe.submit_exam_answer(params).then((res) => {
          if (res.code === 200) {
            setisSubmit(true);
            message.success('提交试卷成功');
            setexamScore(res.data);
            setisShowRes(true);
            // history.push(`/student/training`);
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  };
  /**
   * @description:时间到直接提交考试
   * @param {*}
   * @return {*}
   */
  const submintExam = () => {
    const submitTopicAnswerDTOList: { answer: string; topicId: number }[] = [];
    for (const i in formValues) {
      let answer = formValues[i];
      if (Array.isArray(formValues[i])) {
        answer = (formValues[i] as string[]).join('');
      }
      submitTopicAnswerDTOList.push({
        answer: answer as string,
        topicId: Number(i),
      });
    }
    const params = {
      studentTrainId: query?.id,
      submitTopicAnswerDTOList,
    };
    StudentTrainInfoServe.submit_exam_answer(params).then((res) => {
      if (res.code === 200) {
        setisSubmit(true);
        message.info('考试结束，已自动提交试卷');
        setexamScore(res.data);
        setisShowRes(true);
        // history.push(`/student/training`);
      } else {
        message.error(res.msg);
      }
    });
  };

  /**
   * 获取题目是否被标记
   */
  const markQuestion = (topicId: number) => {
    setmark((oldValue) => {
      return {
        ...oldValue,
        [topicId]: !oldValue[topicId],
      };
    });
  };

  /**根据秒转换时间格式 */
  const translateTime = (time: number) => {
    const Pa = moment.duration(time, 'seconds');
    const hh = Pa.hours();
    const mm = Pa.minutes();
    const ss = Pa.seconds();

    const stringTime = `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}:${
      ss < 10 ? `0${ss}` : ss
    }`;
    setanswerTime(stringTime);
  };
  /**
   * @description: 最后的提交时间
   * @param {*} useMemo
   * @return {*}
   */
  const lastTime = useMemo(() => {
    if (initCurrentTime && totalTime) {
      return initCurrentTime.add(totalTime, 'seconds');
    }
    return undefined;
  }, [initCurrentTime, totalTime]);
  /**
   * @description: 倒计时函数
   * @param {*}
   * @return {*}
   */
  useInterval(
    () => {
      const current = moment();

      if (lastTime) {
        if (current < lastTime) {
          /**当前时间小于最后时间 */
          translateTime(lastTime.diff(current, 'seconds'));
        } else {
          Modal.destroyAll();
          setbool(true);
          submintExam();
        }
      }
    },
    bool ? null : 1000,
    { immediate: true },
  );

  // useInterval(
  //   () => {
  //     if (totalTime === 0) {
  //       Modal.destroyAll()
  //       // 考试时间结束，自动提交试卷
  //       setbool(true);
  //       submintExam()
  //       return
  //     }
  //     if(totalTime){
  //       settotalTime(totalTime - 1);
  //       translateTime(totalTime);
  //     }

  //   },
  //   bool ? null : 1000,
  //   { immediate: true },
  // );
  /**
   * @description: 初始化试卷
   * @param {*}
   * @return {*}
   */
  const assignmentForm = (subjectVOList: Subject[]) => {
    const res: ExamForm = {};
    subjectVOList.map((item) => {
      if (item.subjectTopicVOList && item.subjectTopicVOList.length > 0) {
        item.subjectTopicVOList.map((ite) => {
          res[ite.id] = '';
        });
      }
    });
    upDateFormValues(res);
  };

  useEffect(() => {
    const id = query?.id;
    StudentTrainInfoServe.exam_paper_detail({
      studentTrainId: id, //	学员培训记录id
    }).then((res) => {
      if (res.code === 200) {
        setexamPaper(res.data);
        assignmentForm(res.data.subjectVOList);
        // 传入秒的形式来进行转化时间
        settotalTime(res.data.answerTime * 60);
        setinitCurrentTime(moment());
      } else {
        setisSubmit(true);
        history.push(`/student/training`);
        message.error(res.msg);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 离开页面
  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '确定离开当前考试页面？离开后本次作答不纳入考试成绩。';
    };
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);

  const leave = () => {
    if (isSubmit) {
      return false;
    }
    return true;
  };

  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={130} paddingBottom={10}>
      <CPageViewTop>
        <div className="exam-top fx-row fx-row-center ">
          <p>
            {examPaper?.name} -- 总分：{examPaper?.totalScore}分
          </p>
          <p className="totalTime">剩余时间： {answerTime}</p>
        </div>
      </CPageViewTop>
      <CPageViewContent>
        {/* {JSON.stringify(formValues)} */}
        {/* 考试成绩 */}
        <Modal
          visible={isShowRes}
          title="本次考试结果"
          onCancel={() => {
            setisShowRes(false);
            history.replace(`/student/training`);
          }}
          footer={false}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="考生姓名">{examScore?.name}</Descriptions.Item>
            <Descriptions.Item label="考试分数">{examScore?.score}分</Descriptions.Item>
            <Descriptions.Item label="考试结果">
              {examScore?.isPass === 1 ? '合格' : '不合格'}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
        <div className="exam fx-row fx-row-middle">
          <Prompt
            when={leave()}
            message={() => '确定离开当前考试页面？离开后本次作答不纳入考试成绩。'}
          />

          <div className="content">
            {/* <div className="top fx-row fx-row-center ">
              <p>
                {examPaper?.name} -- 总分：{examPaper?.totalScore}分
              </p>
              <p className="totalTime">剩余时间： {answerTime}</p>
            </div> */}
            {/* {JSON.stringify(formValues)} */}
            <Form form={form} onValuesChange={onValuesChange} onFinish={onFinish}>
              <div className="bottom fx-row ">
                <div className="question fx-1">
                  {examPaper?.subjectVOList?.map((v, i) => {
                    return (
                      <div key={v.subjectId}>
                        <h1 className="subjectName">{`${NumberToChinese(i + 1)}、${
                          v.name
                        }(共${Number(Boolean(v.subjectTopicVOList?.length))}题，${
                          v.subjectScore
                        }分)`}</h1>
                        {v.subjectTopicVOList?.map((m, n) => {
                          return (
                            <div key={m.id} className="fx-row">
                              {
                                <>
                                  <img
                                    src={mark[m.id] ? markFlag : flag}
                                    alt=""
                                    className="image"
                                    onClick={() => markQuestion(m.id)}
                                  />
                                </>
                              }
                              <Form.Item name={m.id} key={m.id}>
                                {
                                  // eslint-disable-next-line no-nested-ternary
                                  m.type === 1 ? ( // 根据每一题的type来判断是什么题型：单选题（1） 判断题（2） 多选题（3）
                                    <Single data={m} index={n + 1} />
                                  ) : m.type === 2 ? (
                                    <Multiple data={m} index={n + 1} />
                                  ) : (
                                    <Judge data={m} index={n + 1} />
                                  )
                                }
                              </Form.Item>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                <div className="record">
                  <div className="item">
                    {examPaper?.subjectVOList?.map((v, i) => {
                      return (
                        <div key={i}>
                          <div className="title">{`${v.name}(共${Number(
                            v.subjectTopicVOList?.length,
                          )}题，${v.subjectScore}分)`}</div>
                          <div className="mark fx-row fx-wrap">
                            {v?.subjectTopicVOList?.map((m, n) => {
                              return (
                                // 完成的题目要添加complete类名， 标记的题目要添加label类名
                                <div
                                  key={m.id}
                                  className={[
                                    'btn',
                                    formValues?.[m.id] && formValues?.[m.id]?.length
                                      ? 'complete'
                                      : '',
                                    mark?.[m.id] ? 'label' : '',
                                  ].join(' ')}
                                >
                                  {n + 1}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="center fx-row">
                    <div className="item fx-row fx-row-middle fx-row-center">
                      <div className="label box"></div>
                      <div>标记</div>
                    </div>

                    <div className="item fx-row fx-row-middle fx-row-center">
                      <div className="complete box"></div>
                      <div>已做</div>
                    </div>

                    <div className="item fx-row fx-row-middle fx-row-center">
                      <div className="unfinished box"></div>
                      <div>未做</div>
                    </div>
                  </div>

                  <div className="bottom">
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        提交试卷
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </CPageViewContent>
    </PageViewPro>
  );
};
export default Exam;
