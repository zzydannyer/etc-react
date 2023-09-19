/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step3/_part/AddSubject/index.tsx
 * @Description: 新增大题 编辑大题
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, Button, Select, message, Table, Modal, InputNumber } from 'antd';
import { useFormGetFieldsValue } from '@/hooks';
import { ExamPaperInfoServe } from '@/commonServe';

/**提交的大题信息 */
interface SubjectForm {
  /** 大题ID */
  subjectId: number;
  /**大题名称 */
  subjectName: string;
  /**试题类型 */
  topicType: number;
  /**每题分数 */
  score: number;
}

interface AddSubjectProps {
  isShowAddSubject: boolean;
  setisShowAddSubject: (b: boolean) => void;
  /**编辑的大题的信息 */
  editData?: Subject;
  /**试卷名称 */
  examPaperName: string;
  /**试题类型 1:单选题 2:多选题 3:判断题*/
  T_TOPIC_INFO: CheckboxGroupOption[];
  /**试卷id */
  examPaperId?: number;
  /**设置试卷的id 并且请求新的大题列表 */
  handleGetSubjectVOList: (id?: number) => void;
}

const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

const AddSubject: FC<AddSubjectProps> = (props) => {
  const {
    isShowAddSubject,
    setisShowAddSubject,
    editData,
    T_TOPIC_INFO,
    examPaperId,
    examPaperName,
    handleGetSubjectVOList,
  } = props;
  /**提交中 */
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm<SubjectForm>();
  const { formValues, onValuesChange, upDateFormValues, resetForm } = useFormGetFieldsValue(form);
  const formRef = useRef<FormInstance<SubjectForm>>();
  const handleCancel = () => {
    // resetForm();
    setisShowAddSubject(false);
  };
  /**提交 */
  const handleOk = () => {
    form.submit();
  };

  /**保存大题信息 */
  const onFinish = () => {
    if (!editData?.subjectId) {
      setconfirmLoading(true);
      ExamPaperInfoServe.post_save_subject({
        ...formValues,
        name: examPaperName,
        examPaperId,
      }).then((res) => {
        setconfirmLoading(false);
        if (res.code === 200) {
          handleGetSubjectVOList(res.data.id);
          handleCancel();
        } else {
          message.error(res.msg);
        }
      });
    } else {
      setconfirmLoading(true);
      ExamPaperInfoServe.post_update_subject({
        ...formValues,
        name: examPaperName,
        subjectId: editData?.subjectId,
        examPaperId,
      }).then((res) => {
        setconfirmLoading(false);
        if (res.code === 200) {
          handleGetSubjectVOList();
          handleCancel();
          // formRef.current?.submit;
        } else {
          message.error(res.msg);
        }
      });
    }
  };
  /**弹框title */
  const modelTitle = useMemo(() => {
    if (editData) {
      return '编辑试卷大题';
    }
    return '添加试卷大题';
  }, [editData]);

  useEffect(() => {
    if (editData?.subjectId && isShowAddSubject) {
      upDateFormValues({
        subjectId: editData?.subjectId,
        subjectName: editData?.name,
        score: editData.score,
      });
    } else {
      resetForm();
    }
  }, [editData, upDateFormValues, resetForm, isShowAddSubject]);

  return (
    <>
      <Modal
        title={modelTitle}
        visible={isShowAddSubject}
        onCancel={handleCancel}
        onOk={handleOk}
        getContainer={false}
        forceRender
        confirmLoading={confirmLoading}
        maskClosable={false}
        destroyOnClose={true}
        width={560}
      >
        {/* {JSON.stringify(formValues)}
        {JSON.stringify(editData?.subjectId)} */}
        <Form
          {...layout}
          onValuesChange={onValuesChange}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          preserve={false}
        >
          <Form.Item
            name="subjectName"
            label="大题名称"
            rules={[
              {
                required: true,
                type: 'string',
                message: '请输入大题名称',
              },
            ]}
          >
            <Input className="c-w-300" maxLength={80} placeholder="请输入大题名称"></Input>
          </Form.Item>
          {!editData?.subjectId && (
            <Form.Item
              name="topicType"
              label="大题题型"
              rules={[
                {
                  required: true,
                  type: 'number',
                  message: '请选择题型',
                },
              ]}
            >
              <Select className="c-w-300" placeholder="请选择">
                {T_TOPIC_INFO &&
                  T_TOPIC_INFO.map((v, i) => {
                    return (
                      <Option key={v.value} value={v.value}>
                        {v.label}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="score"
            label="每题分值"
            rules={[
              {
                required: true,
                type: 'number',
                message: '请输入每题分值',
              },
            ]}
          >
            <InputNumber
              className="c-w-300"
              min={0}
              max={100}
              placeholder="请输入每题分值"
            ></InputNumber>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddSubject;
