/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/upDataVideo/index.tsx
 * @Description:上传视频页面
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Prompt } from 'umi';
import { PageViewPro } from 'shevdc-component';
import { Form, Input, Space, Button, Modal } from 'antd';
import { useFormGetFieldsValue } from '@/hooks';
import { closePage } from '@/utils/util';
import { UploadVideo } from '@/components';
import './index.less';

const { CPageViewContent } = PageViewPro;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '培训管理',
  },
  {
    name: '上传视频'
  },
];
interface UpDataVideoProps {}

const UpDataVideo: FC<UpDataVideoProps> = (props) => {
  const [form] = Form.useForm();
  const { formValues, onValuesChange, upDateFormValues, resetForm } = useFormGetFieldsValue(form);
  /**上传进度 */
  const [percentNum, setpercentNum] = useState<number>(0);

  const upDataIng = useMemo(() => {
    return percentNum > 0;
  }, [percentNum]);

  /**
   * @description: 文件上传成功
   * @param {*}
   * @return {*}
   */
  const uploadSucceed = () => {
    setpercentNum(0);
    upDateFormValues({
      name: '',
    });
  };
  /**
   * @description: 上传失败
   * @param {*}
   * @return {*}
   */
  const uploadFailed = () => {
    setpercentNum(0);
  };
  /**
   * @description: 删除上传的视频
   * @param {*}
   * @return {*}
   */
  const deleteUpload = () => {
    setpercentNum(0);
  };
  /**
   * @description: 上传开始
   * @param {*}
   * @return {*}
   */
  const uploadstarted = () => {
    setpercentNum(0);
  };
  /**
   * @description: 上传进度
   * @param {*}
   * @return {*}
   */
  const uploadProgress = (loadedPercent: number) => {
    setpercentNum(loadedPercent);
  };

  /**关闭页面 */
  const handleClose = () => {
    if (percentNum > 0 && percentNum < 100) {
      Modal.confirm({
        title: '视频上传中，关闭页面会导致上传失败',
        onOk() {
          closePage();
        },
        onCancel() {},
      });
    } else {
      closePage();
    }
  };
  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '视频上传中，关闭页面会导致上传失败';
    };
    if (upDataIng) {
      window.addEventListener('beforeunload', listener);
    }
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [upDataIng]);
  return (
    <>
      <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
        <CPageViewContent className="up-data-video">
          {/* {JSON.stringify(formValues)} */}
          <Form {...layout} onValuesChange={onValuesChange} form={form} name="control-hooks">
            <Form.Item
              name="name"
              label="名称"
              rules={[
                {
                  type: 'string',
                  required: true,
                  message: '请输入名称',
                },
              ]}
            >
              <Input
                disabled={percentNum > 0}
                className="c-w-300"
                maxLength={80}
                placeholder="请输名称"
              ></Input>
            </Form.Item>

              <Form.Item required label="上传">
                <UploadVideo
                  uploadSucceed={uploadSucceed}
                  uploadFailed={uploadFailed}
                  deleteUpload={deleteUpload}
                  uploadstarted={uploadstarted}
                  uploadProgress={uploadProgress}
                  videoName={formValues?.name}
                ></UploadVideo>
              </Form.Item>


            {/* <Form.Item wrapperCol={{ offset: 4 }}>
              <Button onClick={handleClose}>关闭</Button>
            </Form.Item> */}
          </Form>
        </CPageViewContent>
      </PageViewPro>
    </>
  );
};
export default UpDataVideo;
