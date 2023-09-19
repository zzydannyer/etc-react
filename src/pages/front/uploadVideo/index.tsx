/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/front/uploadVideo/index.tsx
 * @Description: 上传测试
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Upload, Button } from 'antd';
import { useCreateVideoUpload } from '@/hooks';
import { UploadVideo as CUploadVideo } from '@/components';

interface UploadVideoProps {}

const UploadVideo: FC<UploadVideoProps> = (props) => {
  /**上传成功 */
  const onUploadSucceed = (uploadInfo: UploadInfo) => {};

  /**失败 */
  const onUploadFailed = (uploadInfo: UploadInfo) => {};

  /**上传进度 */
  const onUploadProgress = (uploadInfo: UploadInfo, totalSize?: number) => {};

  const onUploadstarted = (uploadInfo: UploadInfo) => {};

  const onUploadEnd = (uploadInfo: UploadInfo) => {};

  const uploader = useCreateVideoUpload(
    onUploadstarted,
    onUploadSucceed,
    onUploadFailed,
    onUploadEnd,
  );

  const beforeUpload = (file: File) => {
    uploader.addFile(file, null, null, null, '{"Vod":{}}');
    return false;
  };
  return (
    <>
      <CUploadVideo></CUploadVideo>
      <p></p>
      <Upload fileList={[]} maxCount={1} beforeUpload={beforeUpload}>
        <Button>Select File</Button>
      </Upload>
      <Button
        onClick={() => {
          uploader.startUpload();
        }}
      >
        开始上传
      </Button>
    </>
  );
};
export default UploadVideo;
