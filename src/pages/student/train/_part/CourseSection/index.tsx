import type { FC, Key } from 'react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, history, Link } from 'umi';
import { Menu, Progress, message,Tooltip } from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import { StudentTrainInfoServe } from '@/commonServe';
import type { UrlState } from '../../index.interface';
import './index.less';

const { SubMenu } = Menu;

interface CourseSectionProps {
  data: TrainDetial | undefined;
  rootSubmenuKeys: string[] | undefined;
  open: string[] | undefined;
  /**视频的高度 */
  videoHeight: number | undefined;
  /**更新只有课件的小节的进度 */
  coursewareEnd: (s: number) => void;
  /**视频播放对象 */
  player: any;
}
const CourseSection: FC<CourseSectionProps> = (props) => {
  const { data, rootSubmenuKeys, open, videoHeight, coursewareEnd, player } = props;
  const [selectedKeys, setselectedKeys] = useState<string>('6');
  /**打开的SubMenu */
  const [openKeys, setOpenKeys] = useState<string[]>(open as string[]);
  /**修改 url 参数 */
  const [urlState, setUrlState] = useUrlState<UrlState>();

  const onOpenChange = useCallback(
    (keys: string[]) => {
      const latestOpenKey = keys.find((key) => openKeys?.indexOf(key) === -1);
      if (rootSubmenuKeys?.indexOf(latestOpenKey || '') === -1) {
        setOpenKeys(keys);
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
    },
    [openKeys, rootSubmenuKeys, setOpenKeys],
  );
  /**
   * @description: 切换视频
   * @param {string} videoId 视频id
   * @param {string} sectionId 小节id
   * @param {number} studyPercent 播放进度
   * @return {*}
   */
  const handleChange = (
    sectionId: number,
    studyPercent: number,
    isCurrent: boolean,
    videoId?: string,
  ) => {
    if (studyPercent !== 0 || isCurrent) {
      // 销毁视频
      if (!videoId) {
        if (player && player.dispose) {
          try {
            // 没有视频的时候可能报错 所以try一下
            player.dispose();
          } catch (error) {
            console.log(error);
          }
          // 视频已经在切换的时候被销毁
          // setplayer(undefined);
        }
      }
      setUrlState({
        videoId,
        currentSectionId: sectionId,
      });
    }
  };

  useEffect(() => {
    setselectedKeys(urlState.currentSectionId);
  }, [urlState.currentSectionId]);

  useEffect(() => {
    setOpenKeys(open as string[]);
  }, [open]);

  /**
   * @description: 下载课件 并且更新小节状态
   * @param {string} url 地址
   * @param {boolean} isCurrent 下载的是否为当前小节的课件
   * @param {string} videoId 视频id
   * @return {*}
   */
  const downCourseware = (url: string, isCurrent: boolean, sectionId: number, videoId?: string) => {
    StudentTrainInfoServe.get_tempurl({
      fileUrl: url,
    }).then((res) => {
      if (res.code === 200) {
        /**没有视频id并且是当前的小节 则下载课件的时候完成小节 */
        if (!videoId && isCurrent) {
          coursewareEnd(sectionId);
        }
        window.open(res.data);
      } else {
        message.error(res.msg);
      }
    });
  };
  /**计算高度 */
  const courseSectionHeight = useMemo(() => {
    if (videoHeight) {
      return `${videoHeight - 66}px`;
    }
    return '500px';
  }, [videoHeight]);
  return (
    <div className="courseSection" style={{ height: courseSectionHeight }}>
      <Menu
        mode="inline"
        theme="dark"
        // defaultOpenKeys={['1']}
        className="menu"
        selectedKeys={[selectedKeys]}
      >
        {data?.courseDetailVO.chapterVOList?.map((v, i) => {
          return (
            <SubMenu key={`${v.chapterId + i}y`} title={v.name}>
              {v.sectionVOList &&
                v.sectionVOList?.map((m, n) => {
                  return (
                    <Menu.Item
                      key={`${m.sectionId + i}z`}
                      onClick={() =>
                        handleChange(
                          m.sectionId,
                          m.studyPercent,
                          data.currentSectionId === m.sectionId,
                          m.videoId,
                        )
                      }
                    >
                      <div className="item fx-row fx-row-space-between fx-row-center">
                          <Tooltip zIndex={99999999} className="left fx-3 " placement='left' title={m.name}>
                        <div className="c-ellipsis">
                        {m.name}
                        </div>

                        </Tooltip>
                        {/* <p className="left fx-3 c-ellipsis">{m.name}</p> */}
                        <p className="center fx-3">{m.duration}</p>
                        <Progress
                          percent={m.studyPercent}
                          size="small"

                          // status={m.studyPercent === 100 ? 'success' : 'active'}
                          className="right fx-5"
                          strokeColor="#00B8EE"
                          showInfo={false}
                        />
                        <span className="fx-2">{m.studyPercent}%</span>
                        {m.coursewareUrl &&
                        (data.currentSectionId === m.sectionId || m.studyPercent > 0) ? (
                          <span
                            onClick={() =>
                              downCourseware(
                                m.coursewareUrl,
                                data.currentSectionId === m.sectionId,
                                m.sectionId,
                                m.videoId,
                              )
                            }
                            className=" down-load-courseware fx-3"
                          >
                            <span className="link">下载课件</span>
                          </span>
                        ) : (
                          <span className="down-load-courseware fx-3">
                            &nbsp;&nbsp;

                          </span>
                        )}
                      </div>
                    </Menu.Item>
                  );
                })}
            </SubMenu>
          );
        })}
      </Menu>
    </div>
  );
};
export default CourseSection;
