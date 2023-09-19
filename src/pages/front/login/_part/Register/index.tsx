/*
 * @Author: 陈明烽
 * @FilePath: \evdata-exam\src\pages\front\login\_part\Register\index.tsx
 * @Description: 注册弹窗
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Radio } from 'antd';
import { rules } from './rule';
import type { Personal, Organization } from './interface';

interface RegisterProps {
  isShowRegister: boolean;
  setisShowRegister: (b: boolean) => void;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 20 },
};

const Register: FC<RegisterProps> = (props) => {
  const { isShowRegister, setisShowRegister } = props;
  const [personalForm] = Form.useForm<Personal>();
  const [orgForm] = Form.useForm<Organization>();
  const [registerType, setregisterType] = useState<number>(0); // 0 个人 1机构
  const handleOk = () => {};
  const onPersonalFormFinish = () => {};
  return (
    <Modal
      title="忘记密码"
      visible={isShowRegister}
      width="900px"
      getContainer={false}
      onCancel={() => {
        setisShowRegister(false);
      }}
      onOk={() => {
        handleOk();
      }}
    >
      <div className="c-center">
        <Radio.Group defaultValue={registerType} size="large">
          <Radio.Button value={0}>个人注册</Radio.Button>
          <Radio.Button value={1}>机构注册</Radio.Button>
        </Radio.Group>
      </div>
      {registerType === 0 && (
        <Form
          name="normal_forget"
          className="forget-form"
          initialValues={{ remember: true }}
          onFinish={onPersonalFormFinish}
          form={personalForm}
          {...layout}
        >
          <Form.Item label="用户名">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="密码">
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
          <Form.Item label="确认密码">
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
export default Register;
