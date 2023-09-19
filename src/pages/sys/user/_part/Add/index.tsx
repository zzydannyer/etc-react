/*
 * @Author:cmf
 * @Date: 2020-10-15 09:45:54
 * @LastEditTime: 2021-09-28 09:14:04
 * @LastEditors: Please set LastEditors
 * @Description: 新增用户
 * @FilePath: /evdata-exam/src/pages/sys/user/_part/Add/index.tsx
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Table,
  Typography,
  DatePicker,
  Button,
  Radio,
  TreeSelect,
} from 'antd';
import { rules } from './reles';
import type { ColumnsType } from 'antd/lib/table';
import type { DataNode } from 'rc-tree-select/lib/interface';
import { useFormGetFieldsValue } from '@/hooks';
import type { ChangeUser, Item, TrainingInfo, UserRoles } from '../../user.interface';
import { FormUpload } from '@/components';
import type { CommonModelState } from '@/models/commonModel.interface';

import { SysServe } from '@/commonServe';

const { Title } = Typography;
const { Option } = Select;

interface AddProps {
  isShowAdd: boolean;
  setisShowAdd: (b: boolean) => void;
  treeData?: UserRoles[];
  handleSearch: () => void;
  editData?: Item;

  commonState: CommonModelState;
}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

const sexList = [
  {
    key: '0',
    value: '男',
  },
  {
    key: '1',
    value: '女',
  },
];

const Add: FC<AddProps> = (props) => {
  const { isShowAdd, setisShowAdd, handleSearch, editData, commonState, treeData } = props;
  const { permissions, commonStaticInfo } = commonState; // 权限
  /**静态数据 职位 用户状态 */
  const [form] = Form.useForm<ChangeUser>();
  /**角色 */

  const { formValues, onValuesChange, upDateFormValues,resetForm } = useFormGetFieldsValue<ChangeUser>(form);
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
   * @description: 提交用户信息
   * @param {ChangeUser} values
   * @return {*}
   */
  const handleSaveUser = () => {
    const obj = {
      ...formValues,
      userRoles: formValues?.roleId?.map((v, i) => {
        return {
          roleId: v,
        };
      }),
    };
    console.log(obj);
    SysServe.post_save_user(obj).then((res) => {
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
   * @description: 更新用户信息
   * @param {*}
   * @return {*}
   */
  const handleUpdateUser = () => {
    const obj = {
      ...formValues,
      userRoles: formValues?.roleId?.map((v, i) => {
        return {
          roleId: v,
        };
      }),
    };
    if (editData) {
      obj.id = editData.id;
      obj.staffId = editData.staffId;
    }
    delete obj.password
    SysServe.post_update_user_info(obj).then((res) => {
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
  const onFinish = (values: ChangeUser) => {
    Modal.confirm({
      title: '确认提交吗？',
      onOk: () => {
        if (editData && editData.id) {
          handleUpdateUser();
        } else {
          handleSaveUser();
        }
      },
    });
  };

  const modelTitle = useMemo(() => {
    if (editData) {
      return '编辑用户';
    }
    return '添加用户';
  }, [editData]);

  useEffect(() => {
    if (isShowAdd && editData) {
      const roleId = editData.userRoles.map((item) => {
        return item.roleId;
      });

      upDateFormValues({
        ...editData,
        roleId,
      });
    } else {
      resetForm();
    }
  }, [editData, isShowAdd, resetForm, upDateFormValues]);

  return (
    <Modal
      title={modelTitle}
      visible={isShowAdd}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      forceRender
      width={560}
      maskClosable={false}
      destroyOnClose={true}
    >
      {/* {JSON.stringify(formValues)} */}
      <Form
        onValuesChange={onValuesChange}
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        <Form.Item name="id" label="" style={{ display: 'none' }}></Form.Item>
        <Form.Item name="account" label="账号" rules={rules.account}>
          <Input disabled={!!(editData&&editData.id)} placeholder="请输入账号" maxLength={20} className="c-w-250" />
        </Form.Item>
        <Form.Item name="userName" label="姓名" rules={rules.userName}>
          <Input placeholder="请输入姓名" maxLength={20} className="c-w-250" />
        </Form.Item>
        <Form.Item name="mobile" label="手机" rules={rules.mobile}>
          <Input placeholder="请输入手机" className="c-w-250" />
        </Form.Item>
        <Form.Item name="roleId" label="角色配置" rules={rules.roleIdList}>
          <Select mode="multiple" className="c-w-250" allowClear placeholder="请选择角色配置">
            {treeData &&
              treeData.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.roleName}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态" rules={rules.status}>
          <Radio.Group>
            <Radio value={0}>停用</Radio>
            <Radio value={1}>启用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Add;
