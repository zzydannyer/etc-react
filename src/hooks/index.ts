/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 13:01:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-26 15:37:10
 * @FilePath: /evdata-exam/src/hooks/index.ts
 * @Description: 自定义hooks
 */

import type { RefObject } from 'react';
import { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import type { FormInstance } from 'antd';
import { message } from 'antd';
import { useInterval } from 'ahooks';
import { studentSkin1, studentSkin2 } from '@/utils/videoSkin';
import { VideoServe, StudentTrainInfoServe } from '@/commonServe';

type RecursivePartial<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
    }
  : any;

/**
 * @description: 动态的获取表单中的值
 * @param {*} T
 * @return {*}
 */
export const useFormGetFieldsValue = <T>(form: FormInstance<T>) => {
  const [formValues, setformValues] = useState<Partial<T>>();
  const onValuesChange = useCallback((v: Partial<T>, obj: T) => {
    setformValues((prve) => {
      return {
        ...prve,
        ...obj,
      };
    });
  }, []);
  /**useCallback 返回的是状态函数，在使用的时候可以作为依赖项，如果不使用useCallback，则不能作为依赖项 */
  const upDateFormValues = useCallback(
    (values: Partial<T>) => {
      setformValues((prev) => {
        return {
          ...prev,
          ...values,
        };
      });
      form.setFieldsValue(values as RecursivePartial<T>);
    },
    [form],
  );
  const resetForm = useCallback(() => {
    form.resetFields();
    setformValues(undefined);
  }, [form]);
  return { formValues, onValuesChange, upDateFormValues, resetForm };
};

export const useCreateVideoUpload = (
  /**开始上传 */
  onUploadstarted: (uploadInfo: UploadInfo) => void,
  /**上传进度 */
  onUploadProgress: (uploadInfo: UploadInfo, totalSize: number, loadedPercent: number) => void,
  /**文件上传成功 */
  onUploadSucceed: (uploadInfo: UploadInfo) => void,
  /**上传失败 */
  onUploadFailed: (uploadInfo: UploadInfo, code?: string, message?: string) => void,
  /**上传结束 */
  onUploadEnd?: (uploadInfo: UploadInfo) => void,

  videoName?: string,
) => {
  const [uploader, setuploader] = useState<any>();
  /**视频文件名称 */
  const [fileName, setfileName] = useState<string>();
  useEffect(() => {
    const uploaderObj = new AliyunUpload.Vod({
      //userID，必填，只需有值即可。
      userId: '2221',
      //上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
      region: 'cn-shanghai',
      //分片大小默认1 MB，不能小于100 KB
      partSize: 1048576,
      //并行上传分片个数，默认5
      parallel: 5,
      //网络原因失败时，重新上传次数，默认为3
      retryCount: 3,
      //网络原因失败时，重新上传间隔时间，默认为2秒
      retryDuration: 2,
      timeout: 60000,

      //开始上传
      onUploadstarted: (uploadInfo: UploadInfo) => {
        if (uploadInfo.videoId) {
          //如果uploadInfo.videoId存在，调用刷新视频上传凭证接口
          VideoServe.get_refresh_upload_video({
            videoId: uploadInfo.videoId,
          }).then((res) => {
            if (res.code === 200) {
              onUploadstarted(uploadInfo);
              uploaderObj.setUploadAuthAndAddress(
                uploadInfo,
                res.data.uploadAuth,
                res.data.uploadAddress,
                res.data.videoId,
              );
            }
          });
        } else {
          //如果uploadInfo.videoId不存在，调用获取视频上传地址和凭证接口
          //从视频点播服务获取的uploadAuth、uploadAddress和videoId，设置到SDK里
          VideoServe.post_create_upload_video({
            title: videoName,
            fileName: uploadInfo.file?.name,
          }).then((res) => {
            if (res.code === 200) {
              onUploadstarted(uploadInfo);
              uploaderObj.setUploadAuthAndAddress(
                uploadInfo,
                res.data.uploadAuth,
                res.data.uploadAddress,
                res.data.videoId,
              );
            }
          });
        }
      },
      addFileSuccess: (uploadInfo: UploadInfo) => {
        /**添加文件成功 */
        console.log(`addFileSuccess: ${uploadInfo?.file?.name}`);

        setfileName(uploadInfo?.file?.name);
      },
      //文件上传成功
      onUploadSucceed: (uploadInfo: UploadInfo) => {
        // VideoServe.post_upload_video_save({
        //   name:videoName,
        //   videoId:uploadInfo.videoId
        // }).then((res)=>{
        // })
        onUploadSucceed(uploadInfo);
      },
      //文件上传失败
      onUploadFailed: (uploadInfo: UploadInfo, code: string, _message: string) => {
        onUploadFailed(uploadInfo, code, _message);
      },
      //文件上传进度，单位：字节
      onUploadProgress: (uploadInfo: UploadInfo, totalSize: number, progress: number) => {
        onUploadProgress(uploadInfo, totalSize, Math.ceil(progress * 100));
      },
      //上传凭证或STS token超时
      onUploadTokenExpired: (uploadInfo: UploadInfo) => {
        VideoServe.get_refresh_upload_video({
          videoId: uploadInfo.videoId,
        }).then((res) => {
          if (res.code === 200) {
            uploader.resumeUploadWithAuth(res.data.uploadAuth);
          }
        });
      },
      //全部文件上传结束
      onUploadEnd: (uploadInfo: UploadInfo) => {
        if (onUploadEnd) {
          onUploadEnd(uploadInfo);
        }
        // onUploadEnd && onUploadEnd(uploadInfo);
      },
    });
    setuploader(uploaderObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    onUploadEnd,
    onUploadFailed,
    onUploadProgress,
    onUploadSucceed,
    onUploadstarted,
    // uploader,
    videoName,
  ]);
  return uploader;
};

/**
 * @description: 学员端播放视频
 * @param {string} videoId 视频id
 * @param {string} domId
 * @param {function} upDateCurrentTime 更新当前播放的时间
 * @param {number} progress 当前播放的进度 单位s
 * @return {*}
 */
export const usePlayVideo = (
  videoId: string,
  domId: string,
  upDateCurrentTime: (time: number, isFinish: 0 | 1) => void,
  /**当前小节id */
  currentSectionId: number,
  /**是否已经播放 */
  hasPlay: boolean,
  /**播放进度 */
  progress?: number,
) => {
  /**视频播放凭证 */
  const [playAuth, setplayAuth] = useState<string>();
  /**视频播放地址 */
  const [playUrl, setplayUrl] = useState<string>();
  const [coverUrl, setcoverUrl] = useState<string>();
  /**视频播放对象 */
  const [player, setplayer] = useState<any>();
  /**定时发送时间 */
  const [ineterTime, setineterTime] = useState<number | null>(3000);

  const [urrentTime, seturrentTime] = useState<number>();

  /**定时给后台发生当前播放进度 */
  const sendCurrentTime = useInterval(
    () => {
      if (player && upDateCurrentTime && player.getCurrentTime && player.getStatus) {
        const stu = player.getStatus();
        if (stu === 'playing') {
          upDateCurrentTime(player.getCurrentTime(), 0);
        }
      }
    },
    hasPlay ? null : ineterTime,
  );

  useLayoutEffect(() => {
    if (videoId && playAuth && coverUrl && playUrl && currentSectionId) {
      /**如果有视频播放对象，则更换播放地址 */
      if (player && player.dispose) {
        // player.pause()
        try {
          // 没有视频的时候可能报错 所以try一下
          player.dispose();
        } catch (error) {
          console.log(error);
        }
        // 视频已经在切换的时候被销毁
        setplayer(undefined);
      }

      const p = new Aliplayer({
        id: domId,
        source: playUrl,
        playauth: playAuth,
        cover: coverUrl,
        width: '100%',
        height: '100%',
        isLive: false,
        rePlay: false,
        autoplay: false,
        playsinline: true,
        preload: true,
        controlBarVisibility: 'hover',
        useH5Prism: true,
        /**设置不同的皮肤 */
        skinLayout: hasPlay ? undefined : studentSkin1,
      });
      setplayer(p);
    } else {
      // if (player && player.dispose) {
      //   try {
      //     // 没有视频的时候可能报错 所以try一下
      //     player.dispose();
      //   } catch (error) {
      //     console.log(error);
      //   }
      //   // 视频已经在切换的时候被销毁
      //   setplayer(undefined);
      // }
      // if (player && player.dispose&&!videoId) {
      //   player.dispose();
      //   setplayer(undefined);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, playAuth, domId, coverUrl, playUrl, currentSectionId, hasPlay]);

  /**设置播放进度 */
  useEffect(() => {
    if (videoId && progress && player && player.seek && currentSectionId && !hasPlay) {
      const stu = player.getStatus();
      if (stu === 'init') {
        player.seek(progress);
      }
    }
  }, [progress, player, currentSectionId, hasPlay, videoId]);

  // useEffect(() => {
  //   if (player&&player.seek&&progress) {
  //     player.seek(progress)
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentSectionId, player]);

  /**播放结束 */
  useEffect(() => {
    if (videoId && player && player.on && !hasPlay) {
      player.on('ended', (s: string) => {
        console.log('播放完成')
        setineterTime(null);
        player.dispose();
        upDateCurrentTime(player.getCurrentTime(), 1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, hasPlay]);

  /**获取视频播放凭证、视频播放地址  */
  useEffect(() => {
    if (videoId) {
      setineterTime(3000);
      StudentTrainInfoServe.get_video_playauth({ videoId }).then((res) => {
        if (res.code === 200) {
          setplayAuth(res.data.playAuth);
        } else {
          message.error(res.msg);
        }
      });
      StudentTrainInfoServe.get_play_info({ videoId }).then((res) => {
        if (res.code === 200) {
          setplayUrl(res.data.playInfoList?.[0].playURL);
          setcoverUrl(res.data.videoBase.coverURL);
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [videoId, currentSectionId, hasPlay]);
  return player;
};

/**
 * @description: 发送验证码
 * @param {number} _seconds 定时时间单位：秒
 * @param {string} _codeTips 按钮初始化名称
 * @return {*}
 */
export const useVerificationCode = (_seconds: number, _codeTips?: string)=>{
  /**获取验证码按钮是否可以点击 */
  const [canClick, setcanClick] = useState<boolean>(true);
  /**发送验证码按钮文字 */
  const [codeTips, setcodeTips] = useState<string>(_codeTips||'获取验证码');
  /**是否启用定时器 */
  const [delay, setdelay] = useState<number|null>(null);
  /**当前还剩多少秒 */
  const [currentSecond, setcurrentSecond] = useState<number>(_seconds);
  useInterval(()=>{
    if(currentSecond>0){
      setcanClick(false)
      setcodeTips(`请${currentSecond}秒后重新获取`)
      setcurrentSecond(prev=>prev-1)
    }else{
      setcodeTips(_codeTips||'获取验证码')
      setdelay(null)
      setcanClick(true)
    }
  },delay,{immediate:true})
  /**发送成功触发一下这个函数 */
  const handleClickVerificationCode = ()=>{
    setcurrentSecond(_seconds)
    setdelay(1000)
  }
  /**剩余时间变化 */
  useEffect(() => {
    setcurrentSecond(_seconds)
  }, [_seconds]);
  return {
    /**发送验证码按钮是否可以点击 */
    canClick,
    /**发送验证码按钮文字 */
    codeTips,
    /**发送验证码成功后触发一下这个函数 */
    handleClickVerificationCode
  }
}
