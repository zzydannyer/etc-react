import type { FC } from 'react';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, history, useDispatch } from 'umi';
import { Button, Card, message, Row, Col, Modal } from 'antd';
import { selectAll } from '@/models/commonModel';
import { PageViewPro } from 'shevdc-component';
import { DoubleRightOutlined } from '@ant-design/icons';
import type { StudentHomeInfo, Question } from './index.interface';
import { StuHomePage, StudentTrainInfoServe } from '@/commonServe';
import { useVerificationCode } from '@/hooks';
import should from '@/assets/img/studentHome/should.png';
import complete from '@/assets/img/studentHome/complete.png';
import progress from '@/assets/img/studentHome/progress.png';
import time from '@/assets/img/studentHome/time.png';
// import foot2 from '@/assets/img/studentHome/foot2.png';
// import login from '@/assets/img/studentHome/login.png';
// import learn from '@/assets/img/studentHome/learn.png';
// import exam from '@/assets/img/studentHome/exam.png';
// import finish from '@/assets/img/studentHome/finish.png';
import arrows from '@/assets/img/studentHome/arrows.png';
import './index.less';

const { CPageViewContent, CPageViewFooter } = PageViewPro;

interface HomeProps {}
const Home: FC<HomeProps> = (props) => {
  const [data, setdata] = useState<StudentHomeInfo>();
  /**是否显示更多 */
  const [isShowMore, setisShowMore] = useState<boolean>(false);
  /**问答列表 */
  const [quesetList, setquesetList] = useState<Question[]>([]);



  useEffect(() => {
    StuHomePage.get_student_home_page({}).then((res) => {
      if (res.code === 200) {
        setdata(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  useEffect(() => {
    StudentTrainInfoServe.get_query_question_list({
      pageSize: 10000,
      pageNum: 1,
    }).then((res) => {
      if (res.code === 200) {
        setquesetList(res.data.list || []);
      }
    });
  }, []);
  /**
   * @description: 开始考试
   * @param {*}
   * @return {*}
   */
  const handleStartExam = () => {
    console.log(data);
    history.push(`/student/training/exam?id=${data?.studentTrainId}`);
  };

  const colSpan = useMemo(() => {
    if (data?.shouldFinishTrainNum && data?.shouldFinishTrainNum > 0) {
      return 6;
    }
    return 8;
  }, [data?.shouldFinishTrainNum]);

  return (
    // <PageViewPro isShowCrumb={false} paddingBottom={80}>
    //   <CPageViewContent>
        <div className="home">
          <Modal
            visible={isShowMore}
            footer={false}
            onCancel={() => {
              setisShowMore(false);
            }}
            getContainer={false}
          >
            <div className="help">
              {quesetList.length > 0 &&
                quesetList.map((item, index) => {
                  return (
                    <div key={item.id}>
                      <p className="ques">
                        问题{index + 1}: {item.question}{' '}
                      </p>
                      <p className="answ">回答：{item.answer}</p>
                    </div>
                  );
                })}
            </div>
          </Modal>
          <Row gutter={[32, 32]}>
            <Col span={colSpan}>
              <Card className="card ">
                <div className="div_img">
                  <img className="image" src={should} alt="" />
                </div>
                <h1 className="title">{data?.shouldFinishTrainNum}</h1>
                <h2 className="subtitle">
                  当前培训

                </h2>
              </Card>
            </Col>
            <Col span={colSpan}>
              <Card className="card ">
                <div className="div_img">
                  <img className="image" src={progress} alt="" />
                </div>
                <h1 className="title">{data?.studyProgress}%</h1>
                <h2 className="subtitle">学习完成进度</h2>
              </Card>
            </Col>
            <Col span={colSpan}>
              <Card className="card ">
                <div className="div_img">
                  <img className="image" src={time} alt="" />
                </div>
                <h1 className="title">
                  {data?.studyTime}
                  <span className="fs-14">分钟</span>{' '}
                </h1>
                <h2 className="subtitle">已学习时长</h2>
              </Card>
            </Col>
            {data && data?.shouldFinishTrainNum > 0 && (
              <Col span={6}>
                <Card className="card ">
                  <div className="div_img">
                    <img className="image" src={complete} alt="" />
                  </div>
                  {data?.isExamPass === -1 && <h1 className="title">无</h1>}
                  {data?.isExamPass === 0 && <h1 className="title">未通过</h1>}
                  {data?.isExamPass === 1 && <h1 className="title">已通过</h1>}
                  <div className="subtitle">考试结果</div>
                  {data?.isStudyFinish === 0 && (
                    <h2 className="zero_title">(课程学习完成后可参加考试)</h2>
                  )}
                  {data?.isStudyFinish === 1 &&
                    data?.isExamPass !== 1 &&
                    data?.surplusExamTimes > 0 && (
                      <h2 onClick={handleStartExam} className="zero_title zero_title_1">
                        (请参加考试)
                      </h2>
                    )}
                  {/* {data?.isStudyFinish === 1 && data?.isExamPass === 0 && (
                    <h2 className="zero_title">(考试剩余次数：{data?.surplusExamTimes} 次)</h2>
                  )} */}
                </Card>
              </Col>
            )}

            <Col span={6}>
              <div className="left fx-column fx-row-center ">
                <h2 className="title">入库培训流程</h2>

                <div className="train-step-b train-step-1">
                  登录培训系统
                  {/* <img src={arrows} alt="" className="arrows" /> */}
                </div>
                <div className="arrows-div">
                  <img src={arrows} alt="" className="arrows" />
                  <span className="arrows-text"></span>
                </div>
                <div className="train-step-b train-step-2">
                  <span className="text">课程学习</span>
                </div>
                <div className="arrows-div">
                  <img src={arrows} alt="" className="arrows" />
                  <span className="arrows-text">完成</span>
                </div>
                <div className="train-step-b train-step-3">
                  <span className="text">参加考试</span>
                </div>
                <div className="arrows-div">
                  <img src={arrows} alt="" className="arrows" />
                  <span className="arrows-text">通过</span>
                </div>

                <div className="train-step-b train-step-4">
                  <span className="text">培训完成</span>
                </div>
              </div>
            </Col>
            <Col span={18}>
              <div className="right">
                <div className="explain fx-column">
                  <h2 className="title">入库培训帮助说明</h2>
                  <span className="word">1.培训课程由两部分组成，课程学习和课程考试，培训学员应在规定的培训时间内完成课程学习和课程考试，逾期后平台仅提供课程学习；</span>
                  <span className="word">2.学员进入【我的培训】，可查看培训相关信息，并进行课程学习；</span>
                  <span className="word">
                    {' '}
                    3.学员课程学习完成后，才可进行考试，在【我的培训】中参加考试；
                  </span>
                  <span className="word">
                  4.如果学员课程考试未通过（未合格），可进行补考（补考次数可在【我的培训】中查看）；
                  </span>
                  <span className="word">5.课程考试合格，完成本次培训。</span>
                </div>
                <div className="help">
                  <div className="top fx-row">
                    <h2 className="title">培训常见问题</h2>
                    <Button onClick={() => setisShowMore(true)} type="link" className="more">
                      更多 <DoubleRightOutlined />
                    </Button>
                  </div>
                  {quesetList.length > 0 &&
                    quesetList.slice(0, 3).map((item, index) => {
                      return (
                        <div key={item.id}>
                          <p className="ques">
                            问题{index + 1}: {item.question}{' '}
                          </p>
                          <p className="answ">回答：{item.answer}</p>
                        </div>
                      );
                    })}
                  {/* <p className="ques">问题1: 如何开始课程学习？</p>
                  <p className="answ">
                    回答：【我的培训】-{'>'}【查看详情】-{'>'}【观看课件】
                  </p>
                  <p className="ques">问题2: 什么是课程全部学习完成？</p>
                  <p className="answ">
                    回答：本次培训下的课程视频全部播放完成，如课程中包含ppt课件，课件也需观看学习完成
                  </p>
                  <p className="ques">问题3: 必须按顺序学习课程吗？</p>
                  <p className="answ">
                    {' '}
                    回答：课程需按照章节课程顺序学习，需按照第一章到最后一章的顺序依次学习，更好把控知识结构。
                  </p> */}
                </div>
              </div>
            </Col>
          </Row>
          <div className='home-footer'>
          <div className="home-footer-danwei">主办单位：上海市经济和信息化委员会</div>
        <div className="home-footer-jishu">
          技术支持：上海市新能源汽车公共数据采集与监测研究中心
        </div>
          </div>
        </div>
      /* </CPageViewContent>
      <CPageViewFooter className="home-footer">
        <div className="home-footer-danwei">主办单位：上海市经济和信息化委员会</div>
        <div className="home-footer-jishu">
          技术支持：上海市新能源汽车公共数据采集与监测研究中心
        </div>
      </CPageViewFooter>
    </PageViewPro> */
  );
};
export default Home;
