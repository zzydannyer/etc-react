import type { FC } from 'react';
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { useSelector, history, Link } from 'umi';
import { Button, Space, Card, Tabs, Table, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { selectAll } from '@/models/commonModel';
import { StudentTrainInfoServe } from '@/commonServe';
import { PageViewPro } from 'shevdc-component';
import { useSize } from 'ahooks';
import CourseSection from '../_part/CourseSection';
import Communicate from '../_part/Communicate';
import { usePlayVideo } from '@/hooks';
import type { UrlState } from '../index.interface';
import useUrlState from '@ahooksjs/use-url-state';
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
    name: '培训视频',
  },
];

interface LearningProps {}
const Learning: FC<LearningProps> = (props) => {
  const { location } = history;
  const { pathname, query } = location;
  const vidRef = useRef<HTMLDivElement>(null);
  /**视频播放窗口的大小 */
  const videoDomSize = useSize(vidRef);
  /**是否展示侧边 */
  const [isShowSideBar, setisShowSideBar] = useState<boolean>(false);
  /**培训的详情 */
  const [trainDetail, settrainDetail] = useState<TrainDetial>();
  /**url 参数 */
  const [urlState, setUrlState] = useUrlState<UrlState>();
  /**当前播放的时间 */
  const [currentTime, setcurrentTime] = useState<number>();
  /**当前视频是否已经播放 */
  const [hasPlay, sethasPlay] = useState<boolean>(false);
  /**右边的高度 */
  const sidebarHight = useMemo(() => {
    return videoDomSize.height;
  }, [videoDomSize]);

    /**
   * @description:  获取培训详情 和 当前学习小节的进度
   * @param {*} useCallback
   * @return {*}
   */
     const getTrainDetail = useCallback(()=>{
      StudentTrainInfoServe.train_detail({
        studentTrainId: urlState.studentTrainId,
      }).then((res) => {
        if (res.code === 200) {
          settrainDetail(res.data);
          // setdata(res.data); // 里面有继续学习的小节id: data.currentSectionId
          // const arr: string[] = [];
          // 传给子组件的，用于展开收缩SubMenu

          // 定位学习到的小节的章节id
        } else {
          message.error(res.msg);
        }
      });
    },[urlState.studentTrainId])

  /**当前播放的小节的信息 */
  const currentSectionInfo = useMemo(() => {
    let sectionObj: Section | undefined;
    if (trainDetail && urlState.currentSectionId) {
      const chapterVOList = trainDetail.courseDetailVO?.chapterVOList || [];

      chapterVOList.map((item) => {
        const sectionVOList = item.sectionVOList || [];

        sectionVOList.map((ite) => {
          if (ite.sectionId === Number(urlState.currentSectionId)) {
            sectionObj = ite;
          }
        });
      });
    }
    return sectionObj;
  }, [trainDetail, urlState]);
  /**
   * @description: 所有小节的
   * @param {*} useMemo
   * @return {*}
   */
  const allSectionVOList = useMemo(() => {
    const chapterVOList =
      trainDetail && trainDetail.courseDetailVO ? trainDetail?.courseDetailVO?.chapterVOList : [];
    const allList: Section[] = [];
    chapterVOList.map((item) => {
      const sectionVOList = item.sectionVOList || [];
      sectionVOList.map((ite) => {
        allList.push(ite);
      });
    });
    return allList;
  }, [trainDetail]);

  /**
   * @description: 跳转到下个小节
   * @param {number} currentSectionId 当前小节的id
   * @return {*}
   */
  const jumpNextSection = (currentSectionId: number) => {
    console.log(allSectionVOList)
    const index = allSectionVOList.findIndex((item) => {
      return item.sectionId === currentSectionId;
    });
    console.log(index)
    if (index < 0) {
      return;
    }
    /**培训结束 */
    if(index === allSectionVOList.length-1 ){
      getTrainDetail()
      message.success('您已完成培训，快去考试吧')
      return
    }
    const nextSection = allSectionVOList[index + 1];

    if (nextSection) {
      const q: Record<string, string|null> = {
        currentSectionId: nextSection.sectionId.toString(),
      };
      q.videoId = nextSection.videoId?nextSection.videoId:null
      // if (nextSection.videoId) {
      //   q.videoId = nextSection.videoId;
      // }
      setUrlState(q);
    }
  };

  /**
   * @description: 更新播放进度
   * @param {number} t
   * @param {0} isFinish
   * @return {*}
   */
  const upDateCurrentTime = (t: number, isFinish: 0 | 1) => {
    StudentTrainInfoServe.update_study_progress({
      isFinish,
      progress: t,
      sectionId: urlState.currentSectionId,
      studentTrainId: urlState.studentTrainId,
    }).then((res) => {
      if (isFinish === 1&&res.code === 200) {
        jumpNextSection(Number(urlState.currentSectionId));
      }
    });
    window.setTimeout(() => {
      setcurrentTime(t);
    }, 1000);
  };
  /**
   * @description: 更新只有课件的小节的进度
   * @param {number} sectionId
   * @return {*}
   */
  const coursewareEnd = (sectionId: number) => {
    StudentTrainInfoServe.update_study_progress({
      isFinish: 1,
      progress: 0,
      sectionId,
      studentTrainId: urlState.studentTrainId,
    }).then((res) => {
      jumpNextSection(sectionId);

    });
  };

  /**
   * @description: 下载当前课件
   * @param {*}
   * @return {*}
   */
  const downCourseware = () => {
    StudentTrainInfoServe.get_tempurl({
      fileUrl: currentSectionInfo?.coursewareUrl,
    }).then((res) => {
      if (res.code === 200) {
        /**没有视频id并且是当前的小节 则下载课件的时候完成小节 */
        coursewareEnd(currentSectionInfo?.sectionId || 0);
        window.open(res.data);
      } else {
        message.error(res.msg);
      }
    });
  };

  /**
   * @description: 视频播放
   * @param {*}
   * @return {*}
   */
  const player = usePlayVideo(
    urlState.videoId,
    'J_prismPlayer',
    upDateCurrentTime,
    urlState.currentSectionId,
    currentSectionInfo?.studyPercent === 100,
    currentSectionInfo?.progress,
  );

  /**
   * 获取学员交流信息
   */
  const getMessage = useCallback(() => {
    StudentTrainInfoServe.student_message_find_page({
      pageNum: 1,
      pageSize: 10,
      sectionId: urlState.studentTrainId,
    }).then((res) => {
      if (res.code === 200) {
        // setcommunicationMsg(res.data.list);
        // settotal(res.data.total);
      }
    });
  }, [urlState]);


  /**获取培训详情 */
  useEffect(() => {
    // 获取培训详情 和 当前学习小节的进度
    getTrainDetail()

    // 获取视频播放凭证
  }, [urlState, currentTime, getTrainDetail]);

  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
      <CPageViewContent>
        <div className="learning">
          <div className="learning-content fx-column">
            <div className="title fx-row fx-row-center">{currentSectionInfo?.name}</div>
            {/* <div className="title fx-row fx-row-center">{sectionName}</div> */}
            <div className="video" ref={vidRef} id="J_prismPlayer">
              {!urlState.videoId && (
                <div className="video-download fx-row fx-row-center fx-row-middle">
                  <Button className='video-download-doc' type='primary' size='large' onClick={() => downCourseware()}>查看课件</Button>
                </div>
              )}
            </div>

            {/* {urlState.videoId ? (
              <div className="video" ref={vidRef} id="J_prismPlayer"></div>
            ) : (
              <div ref={vidRef}  className="courseware">
                <Button onClick={()=>downCourseware()} >下载课件</Button>
              </div>
            )} */}

            <div className={['side', isShowSideBar ? 'active' : ''].join(' ')}>
              <div className="fx-row fx-row-center">
                <div
                  className="icon fx-row fx-row-center fx-row-middle"
                  onClick={() => {
                    setisShowSideBar(!isShowSideBar);
                  }}
                >
                  {isShowSideBar ? <RightOutlined /> : <LeftOutlined />}
                </div>
                <div
                  style={{ height: `${sidebarHight}px` }}
                  className={[
                    'sidebar fx-1 fx-row fx-row-middle ',
                    isShowSideBar ? 'light' : '',
                  ].join(' ')}
                >
                  <div className="fx-1">
                    <div className="side-title">课程章节</div>
                    <CourseSection
                      videoHeight={videoDomSize.height}
                      data={trainDetail}
                      rootSubmenuKeys={[]}
                      open={[]}
                      coursewareEnd={coursewareEnd}
                      player={player}
                    />
                  </div>
                  {/* <Tabs defaultActiveKey="1" className="tabs" centered>
                    <TabPane
                      tab={<span className="title">课程章节</span>}
                      key="1"
                      className="tabPane"
                    >
                      <CourseSection
                        videoHeight={videoDomSize.height}
                        data={trainDetail}
                        rootSubmenuKeys={[]}
                        open={[]}
                        coursewareEnd={coursewareEnd}
                        player={player}
                      />
                    </TabPane>
                    <TabPane
                      tab={<span className="title">学员交流</span>}
                      key="2"
                      className="tabPane"
                    >
                      <Communicate
                        currentSectionId={urlState.currentSectionId}
                        studentTrainId={urlState.studentTrainId}
                        videoHeight={videoDomSize.height}
                      />
                    </TabPane>
                  </Tabs> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CPageViewContent>
    </PageViewPro>
  );
};
export default Learning;
