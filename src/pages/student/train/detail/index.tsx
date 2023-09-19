import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useSelector, history, Link } from 'umi';
import { Button, Space, Card, Tabs, Table, Progress, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { selectAll } from '@/models/commonModel';
import { StudentTrainInfoServe } from '@/commonServe';
import { PageViewPro } from 'shevdc-component';
import './index.less';

const { TabPane } = Tabs;
const { CPageViewContent } = PageViewPro;

/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '我的培训',
    address: '/student/training',
  },
  {
    name: '培训详情',
  },
];

interface DetailProps {}
const Detail: FC<DetailProps> = (props) => {
  const { location } = history;
  const { pathname, query } = location;
  /**从后台拿到的数据, 培训详情 */
  const [data, setdata] = useState<TrainDetial>();
  /**id */
  const [studentTrainId, setstudentTrainId] = useState<number>();
  /**继续学习的小节id */
  const [currentSectionId, setcurrentSectionId] = useState<number>();
  /**当前学习小节的视屏上传id */
  const [videoId, setvideoId] = useState<string>();

  /**
   * 下载课件
   */
  const downCourseware = (url: string) => {
    StudentTrainInfoServe.get_tempurl({
      fileUrl: url,
    }).then((res) => {
      if (res.code === 200) {
        window.open(res.data);
      } else {
        message.error(res.msg);
      }
    });
  };

  useEffect(() => {
    const id = query?.id;
    setstudentTrainId(Number(id));
    StudentTrainInfoServe.train_detail({
      studentTrainId: Number(id),
    }).then((res) => {
      if (res.code === 200) {
        setdata(res.data);
        // 如果不存在继续学习的小节id,就赋值为第一章第一节的小节id
        const current =
          res.data.currentSectionId > 0
            ? res.data.currentSectionId
            : res.data.courseDetailVO.chapterVOList[0].sectionVOList[0].sectionId;
        res.data.courseDetailVO.chapterVOList.map(
          (v: { sectionVOList: Section[]; sectionId: number; videoId: string }) => {
            v.sectionVOList?.map((m, n) => {
              if (current === m.sectionId) {
                setvideoId(m.videoId);
              }
            });
          },
        );
        setcurrentSectionId(current);
      } else {
        message.error(res.msg);
      }
    });
  }, [query?.id]);

  const handleToStatds = () => {
    const q: Record<string, string> = {
      studentTrainId: studentTrainId?.toString() || '',
      currentSectionId: currentSectionId?.toString() || '',
    };
    if (videoId) {
      q.videoId = videoId;
    }
    history.push({ pathname: '/student/training/learning', query: q });
  };

  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
      <CPageViewContent>
        <div className="detail">
          <div className="detail-content fx-column fx-row-center">
            <div className="top fx-row fx-row-space-between fx-row-center">
              <p className="title">
                共{data?.totalSectionNum}节 已完成{data?.finishedSectionNum}节
              </p>
              <Button onClick={() => handleToStatds()} className="btn" type="primary" ghost>
                <span >继续学习</span>
              </Button>
            </div>
            <Tabs defaultActiveKey="1" className="tabs">
              {data?.courseDetailVO.chapterVOList.map((v, i) => {
                return (
                  <TabPane
                    tab={<span className="tanPane-title">{v.name}</span>}
                    key={v.chapterId}
                    className="tabPane"
                  >
                    {v.sectionVOList?.map((m, n) => {
                      return (
                        <div className="item fx-row fx-row-center" key={n}>
                          <p className="left">{m.name}</p>

                          <p className="center">{m.duration && <> 视频：{m.duration}</>}</p>
                          <Progress
                            percent={m.studyPercent}
                            className="right"
                            status={m.studyPercent === 100 ? 'success' : 'active'}
                          />
                          {/* {m.coursewareUrl ? (
                            <Button
                              type="link"
                              className="btn"
                              onClick={() => downCourseware(m.coursewareUrl)}
                            >
                              下载课件
                            </Button>
                          ) : (
                            ''
                          )} */}
                        </div>
                      );
                    })}
                  </TabPane>
                );
              })}
            </Tabs>
          </div>
        </div>
      </CPageViewContent>
    </PageViewPro>
  );
};
export default Detail;
