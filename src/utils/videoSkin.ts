/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/utils/videoSkin.ts
 * @Description: 视频播放的皮肤
 */

/**学生 视频播放皮肤 没有进度条 */
export const studentSkin1 = [
  {
    name: 'bigPlayButton',
    align: 'blabs',
    x: 30,
    y: 80,
  },
  {
    name: 'H5Loading',
    align: 'cc',
  },
  {
    name: 'errorDisplay',
    align: 'tlabs',
    x: 0,
    y: 0,
  },
  {
    name: 'tooltip',
    align: 'blabs',
    x: 0,
    y: 56,
  },
  {
    name: 'thumbnail',
  },
  {
    name: 'controlBar',
    align: 'blabs',
    x: 0,
    y: 0,
    children: [
      {
        name: 'playButton',
        align: 'tl',
        x: 15,
        y: 12,
      },
      {
        name: 'timeDisplay',
        align: 'tl',
        x: 10,
        y: 7,
      },

      // {
      //   name: 'volume',
      //   align: 'tr',
      //   x: 5,
      //   y: 10,
      // },
    ],
  },
];
/**学生 视频播放皮肤 有进度条 */
export const studentSkin2 = [
  {
    name: 'bigPlayButton',
    align: 'blabs',
    x: 30,
    y: 80,
  },
  {
    name: 'H5Loading',
    align: 'cc',
  },
  {
    name: 'errorDisplay',
    align: 'tlabs',
    x: 0,
    y: 0,
  },
];
