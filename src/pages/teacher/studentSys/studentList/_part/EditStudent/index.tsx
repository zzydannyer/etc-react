/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/studentSys/studentList/_part/EditStudent/index.tsx
 * @Description: 编辑学员
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Input, Space, Button, Select, message, Table, Modal, InputNumber } from 'antd';
import { useFormGetFieldsValue } from '@/hooks';
import {} from 'umi';
import { StudentInfoServe } from '@/commonServe';
import type { StuFindPage } from '../../studentList.interface';
import { rules } from './rule';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

interface EditStudentProps {
  isShowModal: boolean;
  setisShowModal: (b: boolean) => void;
  studentObj?: StuFindPage;
}
const EditStudent: FC<EditStudentProps> = (props) => {
  const { isShowModal, setisShowModal, studentObj } = props;
  const [form] = Form.useForm<StuFindPage>();
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);
  const { formValues, onValuesChange, upDateFormValues, resetForm } = useFormGetFieldsValue(form);
  const handleCancel = () => {
    setisShowModal(false);
    resetForm();
  };

  const handleOk = () => {
    form.submit();
  };

  const onFinish = () => {
    setconfirmLoading(true);
    StudentInfoServe.post_updata_student({
      ...formValues,
      id: studentObj?.id,
    })
      .then((res) => {
        if (res.code === 200) {
          message.success('修改成功');
          handleCancel();
        } else {
          message.error(res.msg);
        }
      })
      .finally(() => {
        setconfirmLoading(false);
      });
  };

  useEffect(() => {
    if (studentObj && isShowModal) {
      upDateFormValues({
        ...studentObj,
      });
    } else {
      resetForm();
    }
  }, [isShowModal, studentObj, resetForm, upDateFormValues]);
  return (
    <Modal
      title={'编辑学员信息'}
      visible={isShowModal}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      forceRender
      confirmLoading={confirmLoading}
      maskClosable={false}
      destroyOnClose={true}
      width={560}
    >
      <Form
        {...layout}
        onValuesChange={onValuesChange}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item name="company" label="单位" >
          <Input className="c-w-300" maxLength={80} placeholder="请输入单位名称"></Input>
        </Form.Item>
        <Form.Item name="name" label="姓名" rules={rules.name}>
          <Input className="c-w-300" maxLength={20} placeholder="请输入姓名"></Input>
        </Form.Item>
        <Form.Item name="idCardNo" label="身份证" rules={rules.idCardNo}>
          <Input className="c-w-300" placeholder="请输入身份证"></Input>
        </Form.Item>
        <Form.Item name="mobilePhone" label="手机号" rules={rules.mobilePhone}>
          <Input className="c-w-300" placeholder="请输入手机号"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditStudent;
