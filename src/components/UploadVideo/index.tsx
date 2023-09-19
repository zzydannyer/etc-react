/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/components/UploadVideo/index.tsx
 * @Description: 上传视频组件
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button, Upload, Progress, message, notification } from 'antd';
import { DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import { VideoServe } from '@/commonServe';
import { useCreateVideoUpload } from '@/hooks';
import './index.less';

interface UploadVideoProps {
  /**上传开始 */
  uploadstarted?: () => void;
  /**文件上传成功 */
  uploadSucceed?: () => void;
  /**上传失败 */
  uploadFailed?: () => void;
  /**上传进度 */
  uploadProgress?: (loadedPercent: number) => void;
  /**上传结束 */
  uploadEnd?: () => void;
  /**删除上传的视频 */
  deleteUpload?: () => void;
  /**视频的名称 */
  videoName?: string;
}
const UploadVideo: FC<UploadVideoProps> = (props) => {
  const {
    videoName,
    uploadSucceed,
    uploadFailed,
    uploadEnd,
    deleteUpload,
    uploadProgress,
    uploadstarted,
  } = props;
  /**禁止选择文件 */
  // const [uploadDisabled, setuploadDisabled] = useState<boolean>(false);
  /**上传中 */
  const [uploading, setuploading] = useState<boolean>(false);
  /**选择的视频文件信息 */
  const [selectFileInfo, setselectFileInfo] = useState<File>();
  /**上传status */
  const [progressStatus, setprogressStatus] = useState<
    'success' | 'exception' | 'normal' | 'active'
  >('normal');
  /**上传进度 */
  const [percentNum, setpercentNum] = useState<number>(0);

  /**
   * @description: 文件上传成功
   * @param {*} useCallback
   * @return {*}
   */
  const onUploadSucceed = useCallback(
    (uploadInfo: UploadInfo) => {
      notification.success({
        message: '上传成功',
        description: `${videoName}已经上传成功，可以继续上传`,
      });
      if (uploadSucceed) {
        uploadSucceed();
      }
    },
    [videoName],
  );
  /**
   * @description: 上传失败
   * @param {*} useCallback
   * @return {*}
   */
  const onUploadFailed = useCallback((uploadInfo: UploadInfo, code?: string, msg?: string) => {
    setprogressStatus('exception');
    notification.error({
      message: '上传失败',
    });
    if (uploadFailed) {
      uploadFailed();
    }

    setuploading(false);
  }, []);

  /**
   * @description: 上传进度
   * @param {*} useCallback
   * @return {*}
   */
  const onUploadProgress = useCallback(
    (uploadInfo: UploadInfo, totalSize: number, loadedPercent: number) => {
      setpercentNum(loadedPercent);
      if (uploadProgress) {
        uploadProgress(loadedPercent);
      }
    },
    [],
  );
  /**
   * @description: 上传结束
   * @param {*} useCallback
   * @return {*}
   */
  const onUploadEnd = useCallback((uploadInfo: UploadInfo) => {
    setprogressStatus('success');
    setuploading(false);
    if (uploadEnd) {
      uploadEnd();
    }
  }, []);
  /**
   * @description: 开始上传
   * @param {*} useCallback
   * @return {*}
   */
  const onUploadstarted = useCallback((uploadInfo: UploadInfo) => {
    setpercentNum(0);
    setuploading(true);
    setprogressStatus('active');
    if (uploadstarted) {
      uploadstarted();
    }
  }, []);

  /**上传文件对象 */
  const uploader = useCreateVideoUpload(
    onUploadstarted,
    onUploadProgress,
    onUploadSucceed,
    onUploadFailed,
    onUploadEnd,
    videoName,
  );

  /**
   * @description: 上传文件之前
   * @param {File} file
   * @return {*}
   */
  const beforeUpload = (file: File) => {
    setpercentNum(0);
    setprogressStatus('normal');
    const isMp4 = file.type === 'video/mp4';
    const isLt2M = file.size / 1024 / 1024 / 1024 < 5;
    if (!isMp4) {
      message.error('只能上传mp4格式的视频');
      return false;
    }
    if (!isLt2M) {
      message.error('视频最大不超过5G');
      return false;
    }
    uploader.deleteFile(0);

    setselectFileInfo(file);
    uploader.addFile(file, null, null, null, '{"Vod":{}}');
    // setuploadDisabled()
    return false;
  };

  /**
   * @description: 手动上传
   * @param {*}
   * @return {*}
   */
  const handleUpload = () => {
    uploader.startUpload();
  };
  /**删除上传 */
  const handleDeleteUpload = () => {
    uploader.cancelFile(0);
    uploader.deleteFile(0);
    setselectFileInfo(undefined);
    setuploading(false);
    setpercentNum(0);
    if (deleteUpload) {
      deleteUpload();
    }
  };

  return (
    <div className="c-upload-video">
      <Upload disabled={uploading||!videoName} fileList={[]} accept="video/mp4" beforeUpload={beforeUpload}>
        <Button disabled={uploading}>
          选择视频
        </Button>
        <div className="hint">
          <div>视频支持格式：.mp4</div>
          <div>文件大小：单个文件不能超过5G</div>
        </div>
      </Upload>
      {selectFileInfo?.name && (
        <div className="file-info">
          <div className="file-info-s fx-row fx-row-center">
            <PaperClipOutlined style={{ color: '#999' }} />
            <div className="fx-1 file-info-text">{selectFileInfo?.name}</div>
            <DeleteOutlined
              onClick={handleDeleteUpload}
              style={{ color: '#999' }}
              className="file-info-del"
            />
          </div>
          <Progress percent={percentNum} size="small" status={progressStatus} />
        </div>
      )}
      <Button disabled={!videoName}  type="primary" className="to-upload-btn" onClick={handleUpload} loading={uploading}>
        点击上传
      </Button>
    </div>
  );
};
export default UploadVideo;
