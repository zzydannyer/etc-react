/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/playVideo/index.tsx
 * @Description: 播放视频
 */
import * as React from 'react';
import type { FC } from 'react';
import { history } from 'umi';
import { PageViewPro } from 'shevdc-component';
import { VideoServe } from '@/commonServe';
import { useState, useEffect } from 'react';
import {} from 'antd';

interface PlayVideoProps {}
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '培训管理',
  },
  {
    name: '视频播放',
  },
];

const { CPageViewContent } = PageViewPro;

const PlayVideo: FC<PlayVideoProps> = (props) => {
  const { location } = history;
  const { query } = location;
  const videoId = query?.id || '';
  /**播放凭证 */
  const [playAuth, setplayAuth] = useState<string>();
  /**播放地址 */
  const [playURL, setplayURL] = useState<string>();
  /**获取播放凭证  */
  useEffect(() => {
    if (videoId) {
      VideoServe.get_video_play_auth({ videoId }).then((res) => {
        if (res.code === 200) {
          setplayAuth(res.data.playAuth);
        }
      });
      VideoServe.get_play_info({ videoId }).then((res) => {
        if (res.code === 200) {
          setplayURL(res.data.playInfoList && res.data.playInfoList[0].playURL);
        }
      });
    }
  }, [videoId]);

  useEffect(() => {
    if (playAuth && playURL && videoId) {
      const player = new Aliplayer({
        id: 'play_video',
        // source: playURL,
        playauth: playAuth,
        vid: videoId,
        height: '100%',
        width: '100%',
        preload: true,
      });
    }
  }, [playURL, playAuth, videoId]);

  return (
    <>
      <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
        <CPageViewContent className="up-data-video">
          <div id="play_video" style={{ width: '100%', height: '100%' }}></div>
        </CPageViewContent>
      </PageViewPro>
    </>
  );
};
export default PlayVideo;
