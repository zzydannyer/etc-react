import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { rules } from './reles';
import type { ChangeDict, Item } from '../../dict.interface';
import { SysServe } from '@/commonServe';

const { Option } = Select;

interface AddProps {
  isShowAdd: boolean;
  setisShowAdd: (b: boolean) => void;
  allRole?: RoleObj[];
  handleSearch: () => void;
  changeDict?: Item;
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const Add: FC<AddProps> = (props) => {
  const { isShowAdd, setisShowAdd, allRole, handleSearch, changeDict } = props;
  const [form] = Form.useForm<ChangeDict>();
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
  const handleSaveUser = (values: ChangeDict) => {
    const p = {
      ...values,
      id: changeDict ? changeDict.id : '',
    };
    SysServe.post_save_dict(p).then((res) => {
      if (res.code === 200) {
        if (changeDict) {
          message.success('修改成功');
        } else {
          message.success('添加成功');
        }

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
  const onFinish = (values: ChangeDict) => {
    Modal.confirm({
      title: '确认提交吗？',
      onOk: () => {
        handleSaveUser(values);
      },
    });
  };
  useEffect(() => {
    if (isShowAdd && changeDict) {
      form.setFieldsValue({
        label: changeDict.label,
        type: changeDict.type,
        sort: changeDict.sort,
        remarks: changeDict.remarks,
        description: changeDict.description,
        value: changeDict.value,
      });
    } else {
      form.resetFields();
    }
  }, [changeDict, isShowAdd, form]);
  const modelTitle = useMemo(() => {
    if (changeDict) {
      return '编辑字典';
    }
    return '添加字典';
  }, [changeDict]);

  const { TextArea } = Input;
  return (
    <Modal
      title={modelTitle}
      visible={isShowAdd}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      forceRender
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="label" label="名称" rules={rules.label}>
          <Input className="c-w-250" />
        </Form.Item>
        <Form.Item name="value" label="值" rules={rules.value}>
          <Input className="c-w-250" />
        </Form.Item>
        <Form.Item name="type" label="类型" rules={rules.type}>
          <Input className="c-w-250" />
        </Form.Item>
        <Form.Item name="sort" label="排序" rules={rules.sort}>
          <Input className="c-w-250" />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={rules.description}>
          <TextArea className="c-w-250" />
        </Form.Item>
        <Form.Item name="remarks" label="备注" rules={rules.remarks}>
          <TextArea maxLength={100} className="c-w-250" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Add;
