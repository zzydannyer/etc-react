/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/sys/role/_part/Add/index.tsx
 * @Description: 角色编辑与添加
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { rules } from './reles';
import type { ChangeRole } from '../../role.interface';
import { SysServe, RoleServe } from '@/commonServe';

const { Option } = Select;
const { TextArea } = Input;
interface AddProps {
  isShowAdd: boolean;
  setisShowAdd: (b: boolean) => void;
  handleSearch: () => void;
  changeRole?: RoleObj;
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const Add: FC<AddProps> = (props) => {
  const { isShowAdd, setisShowAdd, handleSearch, changeRole } = props;

  const [form] = Form.useForm<ChangeRole>();
  const handleCancel = () => {
    setisShowAdd(false);
  };
  /**
   * @description: 提交
   * @param {type}
   * @return {type}
   */
  const handleOk = () => {
    form.submit();
  };
  /**
   * @description: 保存
   * @param {type}
   * @return {type}
   */
  const handleSaveUser = (values: ChangeRole) => {
    const p = {
      ...values,
    };
    RoleServe.post_save(p).then((res) => {
      if (res.code === 200) {
        message.success('添加成功');
        handleSearch();
        handleCancel();
      } else {
        message.error(res.msg);
      }
    });
  };
  /**
   * @description: 更新
   * @param {type}
   * @return {type}
   */
  const handleUpdataRole = (values: ChangeRole) => {
    const p = {
      ...values,
      id: changeRole ? changeRole.id : '',
    };
    RoleServe.post_update(p).then((res) => {
      if (res.code === 200) {
        message.success('修改成功');
        handleSearch();
        handleCancel();
      } else {
        message.error(res.msg);
      }
    });
  };
  /**
   * @description: 校验完成
   * @param {type}
   * @return {type}
   */
  const onFinish = (values: ChangeRole) => {
    Modal.confirm({
      title: '确认提交吗？',
      onOk: () => {
        if (changeRole) {
          handleUpdataRole(values);
        } else {
          handleSaveUser(values);
        }
      },
    });
  };
  /**
   * @description: 把原始数据赋值给能更新数据
   * @param {type}
   * @return {type}
   */
  useEffect(() => {
    if (changeRole) {
      form.setFieldsValue({
        roleName: changeRole.roleName,
        remark: changeRole.remark,
      });
    } else {
      form.resetFields();
    }
  }, [changeRole, form]);
  const modelTitle = useMemo(() => {
    if (changeRole) {
      return '编辑角色';
    }
    return '添加角色';
  }, [changeRole]);

  return (
    <Modal
      destroyOnClose={true}
      title={modelTitle}
      visible={isShowAdd}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      forceRender
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="roleName" label="角色名" rules={rules.roleName}>
          <Input maxLength={20} placeholder="请输入角色名" className="c-w-250" />
        </Form.Item>
        <Form.Item name="remark" label="备注" rules={rules.remark}>
          <TextArea maxLength={100} showCount className="c-w-250" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Add;
