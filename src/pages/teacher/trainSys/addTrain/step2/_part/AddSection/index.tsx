/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step2/_part/AddSection/index.tsx
 * @Description: 新增小节
 */

import * as React from 'react';
import type { FC } from 'react';
import { history } from 'umi';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Form, Input, Space, Button, Select, message, Table, Modal } from 'antd';
import { useFormGetFieldsValue } from '@/hooks';
import { CourseInfoServe } from '@/commonServe';
import { SelectMedia, FormUpload } from '@/components';
import { rules } from './rules';

interface AddSectionProps {
  /**章节信息 */
  chapterInfo?: Chapter;
  /**是否显示添加 编辑小节 */
  isShowChapter: boolean;

  setisShowChapter: (b: boolean) => void;
  /**编辑的小节信息 */
  editData?: Section;
  /**获取最新的 章列表 小节信息 */
  handleGetCourseInfo: (_courseId?: number) => void;
}

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

const AddSection: FC<AddSectionProps> = (props) => {
  const { chapterInfo, setisShowChapter, isShowChapter, editData, handleGetCourseInfo } = props;
  const [form] = Form.useForm<Section>();
  /**是否提交中 */
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);
  const { formValues, onValuesChange, upDateFormValues, resetForm } = useFormGetFieldsValue(form);
  /**是否显示选择视频 */
  const [isShowSelectMedia, setisShowSelectMedia] = useState<boolean>(false);
  /**选择的视频名称 */
  const [videoTitle, setvideoTitle] = useState<string>('');
  /**弹框title */
  const modelTitle = useMemo(() => {
    if (editData) {
      return `编辑小节-${chapterInfo?.name}`;
    }
    return `新增小节-${chapterInfo?.name}`;
  }, [editData, chapterInfo]);

  const handleCancel = () => {
    resetForm();
    setvideoTitle('');
    setisShowChapter(false);
  };
  /**编辑 */
  const handelEdit = () => {
    CourseInfoServe.post_update_section({
      ...formValues,
      chapterId: chapterInfo?.chapterId,
      sectionId: editData?.sectionId,
    }).then((res) => {
      if (res.code === 200) {
        resetForm();
        message.success('修改小节成功');
        handleGetCourseInfo();
        setvideoTitle('');
        setisShowChapter(false);
      }
    });
  };
  /**新增小节 */
  const handleAdd = () => {
    CourseInfoServe.post_save_section({
      ...formValues,
      chapterId: chapterInfo?.chapterId,
    }).then((res) => {
      if (res.code === 200) {
        resetForm();
        message.success('新增小节成功');
        handleGetCourseInfo();
        setvideoTitle('');
        setisShowChapter(false);
      } else {
        message.error(res.msg);
      }
    });
  };
  /** */
  const handleOk = () => {
    if (!formValues?.videoId && !formValues?.coursewareUrl) {
      message.error('请选择视频或者上传课件');
      return;
    }
    form.submit();
  };
  /** */
  const onFinish = () => {
    if (editData?.sectionId) {
      handelEdit();
    } else {
      handleAdd();
    }
  };
  /**视频上传id */
  const handleSelectVideo = (_videoId: string, _videoTitle: string) => {
    upDateFormValues({
      videoId: _videoId,
    });
    setvideoTitle(_videoTitle);
  };
  /**上传文件 */
  const handleChangeUploadFile = (url: string[]) => {
    upDateFormValues({
      coursewareUrl: url.length > 0 ? url[0] : '',
    });
  };
  useEffect(() => {
    if (isShowChapter) {
      if (editData?.sectionId) {
        upDateFormValues({
          ...editData,
        });
        setvideoTitle(editData.title);
      } else {
        setvideoTitle('');
        resetForm();
      }
    }
  }, [editData, upDateFormValues, resetForm, isShowChapter]);
  return (
    <>
      <Modal
        title={modelTitle}
        visible={isShowChapter}
        onCancel={handleCancel}
        onOk={handleOk}
        getContainer={false}
        forceRender
        confirmLoading={confirmLoading}
        maskClosable={false}
        destroyOnClose={true}
        width={680}
      >
        {/* 选择视频 */}
        <SelectMedia
          isShowSelectMedia={isShowSelectMedia}
          setisShowSelectMedia={setisShowSelectMedia}
          handleSelectVideo={handleSelectVideo}
          selectVideoId={formValues?.videoId}
        ></SelectMedia>
        {/* {JSON.stringify(formValues)} */}
        <Form
          {...layout}
          onValuesChange={onValuesChange}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          preserve={false}
        >
          <Form.Item name="name" label="小节名称" rules={rules.name}>
            <Input className="c-w-300" maxLength={80} placeholder="请输小节名称,如：第1节课"></Input>
          </Form.Item>
          <Form.Item label="选择视频" name="videoId">
            <Space>
              {videoTitle && (
                <Button
                  href={`/teacher/playVideo?videoId=${formValues?.videoId}`}
                  target="_blank"
                  type="link"
                >
                  {videoTitle}
                </Button>
              )}
              <Button
                onClick={() => {
                  setisShowSelectMedia(true);
                }}
                type="primary"
              >
                选择视频
              </Button>

              <Button href="/teacher/trainSys/upDataVideo" target="_blank" type="link">
                上传视频
              </Button>
            </Space>
          </Form.Item>
          <Form.Item label="上传课件" name="coursewareUrl">
            <FormUpload
              action="/evdata-ets-api/api/courseInfo/uploadCourseware"
              label="coursewareUrl"
              acceptType={['pdf', 'word','ppt']}
              maxCount={1}
              value={[formValues?.coursewareUrl || '']}
              size={50}
              onchange={handleChangeUploadFile}
              extra="支持格式：.doc .docx .ppt .pptx .pdf ，单个文件不能超过50MB"
            ></FormUpload>
          </Form.Item>
          <Form.Item label="小节介绍" name="description" rules={rules.description}>
            <TextArea showCount placeholder="请输入内容" maxLength={500}></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddSection;
