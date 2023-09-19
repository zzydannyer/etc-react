/*
 * @Author: 刘同亮
 * @FilePath: /evdata-exam/src/pages/layout/common/_part/upmodify.tsx
 * @Description: 描述
 */
import * as React from 'react';
import type { FC } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { SysServe, post_logout } from '@/commonServe';
import type { History } from 'history';
import { Location } from 'history';
import { isPasswordValidator } from '@/utils/validate';
import type { ItemObj } from '../confCheckItemInfo.interface';
import { Md5 } from 'ts-md5/dist/md5';

interface HeaderRrightProps {
  visible: boolean;
  history: History;
  setismodeDetail: () => void;
  handleLyout: () => void;
}

const HeaderRright: FC<HeaderRrightProps> = (props) => {
  const { visible, history, setismodeDetail } = props;
  const [form] = Form.useForm();
  // 修改密码
  const onFinish = (values: ItemObj) => {
    SysServe.post_user_update_password({
      newPassword: Md5.hashStr(values.newPassword),
      oldPassword: Md5.hashStr(values.oldPassword),
    }).then((res) => {
      if (res.code === 200) {
        message.success('修改成功');
        post_logout().then(() => {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('userName');
          window.localStorage.removeItem('isStudent');
          window.localStorage.removeItem('studentToken');
          // history.replace('/front/login');
          window.location.href = `${window.location.origin}/front/login`;
        });
      } else {
        message.error(res.msg);
      }
    });
  };
  // 提交
  const handleOK = () => {
    form.submit();
  };
  // 关闭弹框
  const handleCancel = () => {
    setismodeDetail();
  };
  return (
    <div className="base-right-header">
      <Modal
        title="修改密码"
        visible={visible}
        onOk={handleOK}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ type: 'string', required: true, message: '请输入密码' }]}
          >
            <Input.Password maxLength={20} />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            hasFeedback
            rules={[
              {
                type: 'string',
                required: true,
                validator: (_, value) => {
                  return isPasswordValidator(_, value, '密码');
                },
              },
            ]}
          >
            <Input.Password maxLength={20} />
          </Form.Item>
          <Form.Item
            label="再次输入新密码"
            name="newPassword2"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请再次输入新密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两个新密码输入不同!'));
                },
              }),
            ]}
          >
            <Input.Password maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default HeaderRright;
