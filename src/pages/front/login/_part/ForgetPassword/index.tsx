/*
 * @Author: 陈明烽
 * @FilePath: \evdata-exam\src\pages\login\_part\ForgetPassword\index.tsx
 * @Description: 忘记密码
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { rules } from './rule';

interface ForgetPasswordForm {
  phoneNumber: number;
  sys: number;
  password: string;
  password2: string;
}

interface ForgetPasswordProps {
  isShowForgetPassword: boolean;
  setisShowForgetPassword: (b: boolean) => void;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 20 },
};

const ForgetPassword: FC<ForgetPasswordProps> = (props) => {
  const { isShowForgetPassword, setisShowForgetPassword } = props;
  const [form] = Form.useForm<ForgetPasswordForm>();
  const handleOk = () => {
    form.submit();
  };

  const onFinish = () => {};

  return (
    <Modal
      title="忘记密码"
      visible={isShowForgetPassword}
      width="400px"
      getContainer={false}
      onCancel={() => {
        setisShowForgetPassword(false);
      }}
      onOk={() => {
        handleOk();
      }}
    >
      <Form
        name="normal_forget"
        className="forget-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        {...layout}
      >
        <Form.Item name="phoneNumber" label="手机号码" rules={rules.phoneNumber}>
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item name="sys" label="消息验证码" rules={rules.sys}>
          <Space>
            <Input placeholder="请输入验证码" />
            <Button type="primary">获取验证码</Button>
          </Space>
        </Form.Item>
        <Form.Item name="password" label="新密码" rules={rules.password}>
          <Input type="password" placeholder="请输入密码" />
        </Form.Item>
        <Form.Item name="password2" label="确认新密码" rules={rules.password2}>
          <Input type="password" placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ForgetPassword;
