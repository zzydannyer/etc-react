/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/trainDetial/trainDetial.tsx
 * @Description:培训详情
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo,useCallback } from 'react';
import { PageViewPro, Icon } from 'shevdc-component';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import { history, useSelector } from 'umi';
import { TrainInfoServe, CourseInfoServe, get_temp_url, TopicInfoServe } from '@/commonServe';
import { Typography, Divider, Descriptions, message, Table, Button, Space, Modal } from 'antd';
import { selectAll } from '@/models/commonModel';
import { hidePhone, hideIdCard } from '@/utils/util';
import { AnswerRecord, TopicDetial } from '@/components';
import ChatRecord from './_part/ChatRecord';
import './trainDetial.less';

const { Title, Paragraph, Text, Link } = Typography;
const { CPageViewContent } = PageViewPro;
const linkRrouters: LinkRrouter[] = [
  {
    name: '培训管理',
  },
  {
    name: '培训列表',
    address: '/teacher/trainSys/trainList',
  },
  {
    name: '培训详情',
  },
];

interface TrainDetialProps {}
const TrainDetial: FC<TrainDetialProps> = (props) => {
  const { commonState } = useSelector(selectAll);
  const { permissions, EXAM_PASS } = commonState;
  const { location } = history;
  const { query } = location;
  /**培训详情 */
  const [trainDetial, settrainDetial] = useState<TrainDetial>();
  /**选择的课程详情 */
  const [courseDetail, setcourseDetail] = useState<CourseDetail>();
  /**是否显示题目详情 */
  const [isShowTopic, setisShowTopic] = useState<boolean>(false);
  /**试题详情 */
  const [topicDetial, settopicDetial] = useState<SubjectTopic>();
  /**是否显示答题记录 */
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  /**答题记录id */
  const [answerId, setanswerId] = useState<number>();
  /**是否显示聊天记录 */
  const [isShowChatRecord, setisShowChatRecord] = useState<boolean>(false);
  /**聊天记录小节id */
  const [chatRecordSectionId, setChatRecordSectionId] = useState<number>();
  /**显示的手机号id */
  const [showPhoneId, setshowPhoneId] = useState<number[]>([]);
  useEffect(() => {
    if (query?.id) {
      TrainInfoServe.get_find_by_id({ id: query?.id }).then((res) => {
        if (res.code === 200) {
          settrainDetial(res.data);
        } else {
          message.error('暂无该培训信息');
        }
      });
    }
  }, [query]);
   /**
   * @description: 显示手机号 全
   * @param {number} id
   * @return {*}
   */
    const handleShowphone = useCallback(
      (id: number) => {
        if (showPhoneId.includes(id)) {
          const index = showPhoneId.findIndex((_id) => _id === id);
          const d = [...showPhoneId];
          d.splice(index, 1);
          setshowPhoneId(d);
          // showPhoneId.splice(arr.findIndex(item => item.id === data.id), 1)
        } else {
          setshowPhoneId((prve) => {
            return [...prve, id];
          });
        }
      },
      [showPhoneId],
    );
  /**
   * @description: 查看课件
   * @param {string} url
   * @return {*}
   */
  const handleViewCoursewareUrl = (url: string) => {
    get_temp_url({ fileUrl: url }).then((res) => {
      window.open(res.data);
    });
  };

  /**
   * @description: 重发短信
   * @param {number} id
   * @return {*}
   */
  const handleReSendSms = (idList: number[]) => {
    Modal.confirm({
      title:'确定重发短信吗？',
      onOk:()=>{
        TrainInfoServe.post_re_send_sms({
          id: query?.id,
          studentIdList: idList,
        }).then((res) => {
          if (res.code === 200) {
            message.success('发送成功');
          } else {
            message.error(res.msg);
          }
        });
      }
    })

  };
  /**
   * @description: 重发全部短信
   * @param {*}
   * @return {*}
   */
  const handleReSendSmsAll = () => {
    Modal.confirm({
      title:'确定重发短信吗？',
      onOk:()=>{
        TrainInfoServe.post_re_send_sms({
          id: query?.id,
          studentIdList: trainDetial?.studentTrainVOList.map((item) => {
            return item.id;
          }) || [],
        }).then((res) => {
          if (res.code === 200) {
            message.success('发送成功');
          } else {
            message.error(res.msg);
          }
        });
        // handleReSendSms(

        // );
      }
    })

  };
  /**
   * @description: 查看试题
   * @param {*}
   * @return {*}
   */
  const handleViewTopic = (value: SubjectTopic) => {
    TopicInfoServe.get_find_by_id({ id: value.id }).then((res) => {
      if (res.code === 200) {
        settopicDetial(res.data);
        setisShowTopic(true);
      } else {
        message.error(res.msg);
      }
    });
    // settopicDetial(value)
    // setisShowTopic(true)
  };
  /**
   * @description: 导出学员
   * @param {*}
   * @return {*}
   */
  const handleExportStudent = ()=>{
    TrainInfoServe.get_export_student(query?.id as string)
  }
  /**
   * @description: 查看学员交流记录
   * @param {number} sectionId
   * @return {*}
   */
  const handleViewChat = (sectionId: number) => {};

  const SubjectColumns: ColumnsType<Subject> = [
    {
      title: '试题题干',
      // dataIndex: 'name',
      // key: 'name',
      width: '200px',
      render: (value) => {
        if (value) {
          if (value.name) {
            return (
              <>
                <Icon type="fa-pencil-square-o"></Icon>
                {value.name}
              </>
            );
          }
          return value.content;
        }
        return '';
      },
    },
    {
      title: '试题类型',
      dataIndex: 'typeName',
      key: 'typeName',
      width: '100px',
    },
    {
      title: '答案',
      dataIndex: 'answer',
      key: 'answer',
    },
    {
      title: '分数',

      key: 'score',
      render: (value) => {
        return (
          <>
          {value.content?value.score:''}
          </>
        )
      }

    },
    {
      title: '操作',
      width: '200px',
      align: 'center',
      render: (value, record, index) => {
        return (
          <Space>
            {value.content && (
              <>
                <Button onClick={() => handleViewTopic(value)} size="small" type="link">
                  查看试题
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const comboBoxColumns: ColumnsType<Chapter> = [
    {
      title: '章节',
      width: '300px',
      key: 'name',
      render: (value, _) => (
        <>
          {!value.sectionId && (
            <>
              <Icon type="fa-bookmark-o"></Icon>
            </>
          )}

          {value.name}
        </>
      ),
    },
    {
      title: '介绍',
      dataIndex: 'description',
      key: 'age',
      width: '300px',
    },
    {
      title: '学时(分钟)',
      dataIndex: 'duration',
      key: 'duration',
      width: '200px',
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: '200px',
      align: 'center',
      render: (value, _) => (
        <>
          {value.videoId && (
            <Button href={`/teacher/playVideo?id=${value.videoId}`} target="_blank" type="link">
              查看视频
            </Button>
          )}

          {value.coursewareUrl && (
            <Button onClick={() => handleViewCoursewareUrl(value.coursewareUrl)} type="link">
              查看课件
            </Button>
          )}
          {/* {value.sectionId && (
            <Button
              onClick={() => {
                // handleViewChat(value.sectionId)
                setisShowChatRecord(true);
                setChatRecordSectionId(value.sectionId);
              }}
              type="link"
            >
              查看学员交流
            </Button>
          )} */}
        </>
      ),
    },
  ];

  const columns: ColumnsType<StudentTrainVO> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '150px',
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      align: 'center',
      render: (v, record) => {
        return (
          <Space>
            <span>
              {showPhoneId.includes(record.id as number)
                ? record.mobilePhone
                : hidePhone(record.mobilePhone || '')}
            </span>
            <EyeFilled onClick={() => handleShowphone(record.id || -1)}></EyeFilled>
          </Space>
        );
      },
    },
    {
      title: '是否登录',
      dataIndex: 'loginStatus',
      key: 'loginStatus',
      align: 'center',
      width: '80px',
      render: (value, row) => {
        return <>{row.loginStatus === 1?'是':'否'}</>;
      },
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '80px',
      render: (value, row) => {
        return <>{row.studentStatus === 1?'已启用':'禁用'}</>;
      },
    },
    {
      title: '是否完成课程',
      dataIndex: 'isStudyFinish',
      key: 'isStudyFinish',
      align: 'center',
      width: '120px',
      render: (value, row) => {
        return <>{row.isStudyFinish === 0 ? '未完成' : '完成'}</>;
      },
    },
    {
      title: '是否通过考试',
      dataIndex: 'isExamPass',
      key: 'isExamPass',
      align: 'center',
      width: '120px',
      render: (value, row) => {
        return <>{EXAM_PASS[row.isExamPass]}</>;
      },
    },
    {
      title: '最高成绩',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      width: '90px',
    },
    {
      title: '考试次数',
      dataIndex: 'examTimes',
      key: 'examTimes',
      align: 'center',
      width: '90px',
    },

    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: '270px',
      align: 'center',
      render: (v, _) => (
        <>
          <Button
            onClick={() => {
              setanswerId(_.studentTrainId);
              setShowAnswer(true);
            }}
            type="link"
          >
            查看答题记录
          </Button>
          {/* {permissions['business:train:sms'] && (trainDetial?.status === 2||trainDetial?.status === 1) && (
            <Button onClick={() => handleReSendSms([_.id])} type="link">
              重发短信
            </Button>
          )} */}
        </>
      ),
    },
  ];
  return (
    <>
      <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
        <CPageViewContent className="train_detial">
          <ChatRecord
            setisShowChatRecord={setisShowChatRecord}
            isShowChatRecord={isShowChatRecord}
            sectionId={chatRecordSectionId}
          ></ChatRecord>
          {/* 试题详情 */}
          <TopicDetial
            isShowTopic={isShowTopic}
            setisShowTopic={setisShowTopic}
            topicDetial={topicDetial}
          ></TopicDetial>
          {/* 答题记录 */}
          <AnswerRecord
            showAnswer={showAnswer}
            answerId={answerId}
            setShowAnswer={setShowAnswer}
          ></AnswerRecord>
          <div className="train_detial-padding">
            <Title level={5}>
              基本信息
              <span className="fs-12 train-status">培训状态：{trainDetial?.statusName}</span>
            </Title>
            <Divider></Divider>
            <Paragraph>
              <Descriptions column={2} size={'middle'}>
                <Descriptions.Item label="培训名称">{trainDetial?.name}</Descriptions.Item>
                <Descriptions.Item label="起止时间">
                  {trainDetial?.startTime} ~ {trainDetial?.endTime}
                </Descriptions.Item>
                <Descriptions.Item label="培训说明" span={2}>
                  {trainDetial?.description}
                </Descriptions.Item>
              </Descriptions>
            </Paragraph>
            <Title level={5}>培训学员</Title>
            <Divider></Divider>
            {trainDetial && trainDetial.studentTrainVOList && (
              <Paragraph>
                {/* {trainDetial.studentTrainVOList.length > 0 &&
                  (trainDetial.status === 2||trainDetial?.status === 1) &&
                  permissions['business:train:sms'] && (
                    <div className="send_all_sm">
                      <Button onClick={() =>{

                        handleReSendSmsAll()

                      }} type="link">
                        重发培训短信
                      </Button>
                    </div>
                  )} */}
                  <div className="send_all_sm">
                    <Button onClick={handleExportStudent} type='link'>导出培训学员</Button>
                  </div>
                <Table
                  size="small"
                  rowKey="id"
                  pagination={{ defaultPageSize: 5 }}
                  bordered
                  dataSource={trainDetial?.studentTrainVOList || []}
                  columns={columns}

                />
              </Paragraph>
            )}

            <Title level={5}>课程信息</Title>
            <Divider></Divider>
            <Paragraph>
              <Table
                size="small"
                rowKey="name"
                columns={comboBoxColumns}
                childrenColumnName="sectionVOList"
                dataSource={(trainDetial && trainDetial.courseDetailVO?.chapterVOList) || []}
              ></Table>
            </Paragraph>
            <Title level={5}>
              考试信息
              {trainDetial?.examPaperDetailVO && trainDetial?.examPaperDetailVO.subjectVOList && (
                <span className="total-score fs-12">
                  共{trainDetial?.examPaperDetailVO.subjectVOList.length}题，共
                  {trainDetial?.examPaperDetailVO.totalScore}分
                </span>
              )}
            </Title>
            <Divider></Divider>

            {trainDetial && trainDetial.examPaperDetailVO && (
              <Paragraph>
                <Descriptions column={2} size={'middle'}>
                  <Descriptions.Item label="及格分数">{trainDetial.passingScore}</Descriptions.Item>
                  <Descriptions.Item label="答题时间">
                    {trainDetial.answerTime}分钟
                  </Descriptions.Item>
                  <Descriptions.Item label="可考次数">{trainDetial.maxExamTimes}</Descriptions.Item>
                  <Descriptions.Item label="考试须知">{trainDetial.notice}</Descriptions.Item>
                </Descriptions>

                <Table
                  size="small"
                  rowKey="name"
                  className="subject-table"
                  columns={SubjectColumns}
                  //展开的行，控制属性

                  // 点击展开图标时触发

                  indentSize={25}
                  pagination={false}
                  childrenColumnName="subjectTopicVOList"
                  // rowSelection={{ ...rowSelection, checkStrictly }}
                  dataSource={trainDetial?.examPaperDetailVO.subjectVOList || []}
                ></Table>
                {/* {trainDetial?.examPaperDetailVO&&()} */}
              </Paragraph>
            )}
          </div>
        </CPageViewContent>
      </PageViewPro>
    </>
  );
};
export default TrainDetial;
