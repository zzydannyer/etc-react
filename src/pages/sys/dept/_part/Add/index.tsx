import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, Select, message, InputNumber, TreeSelect } from 'antd';
import type { DataNode } from 'rc-tree-select/lib/interface';
import { rules } from './rules';

import { SysServe } from '@/commonServe';

const { Option } = Select;

interface AddProps {
  isShowModal: boolean;
  setisShowModal: (b: boolean) => void;
  handleSearch: () => void; // 重新刷新
  editData?: DeptObj;
  dataSource: DeptObj[]; // 所有的数据
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const getChildTree = (list?: DeptObj[]) => {
  const tree: DataNode[] = [];
  // console.log(list)
  if (list) {
    list.map((item: DeptObj) => {
      if (item.name !== '首页') {
        tree.push({
          title: item.name,
          value: item.id,
          children: getChildTree(item.children),
        });
      }
    });
  }
  return tree;
};

const Add: FC<AddProps> = (props) => {
  const { isShowModal, setisShowModal, handleSearch, editData, dataSource } = props;
  const [form] = Form.useForm<DeptObj>();
  /**
   * @description: 获取上级菜单目录
   * @param {*}
   * @return {*}
   */
  const menuTree: DataNode[] = useMemo(() => {
    if (dataSource.length === 0) {
      return [];
    }
    const children = getChildTree(dataSource);
    return [
      {
        title: '顶级机构',
        value: 0,
        children,
      },
    ];
  }, [dataSource]);
  const handleCancel = () => {
    setisShowModal(false);
  };
  /**
   * @description: 提交
   * @param {type}
   * @return {type}
   */
  const handleOk = () => {
    form.submit();
  };
  const handleSaveUser = (values: DeptObj) => {
    const p: DeptObj = {
      ...values,
    };
    if (editData) {
      p.id = editData.id;
    }
    SysServe.post_deot_save(p).then((res) => {
      if (res.code === 200) {
        if (editData) {
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
  const onFinish = (values: DeptObj) => {
    Modal.confirm({
      title: '确认提交吗？',
      onOk: () => {
        handleSaveUser(values);
      },
    });
  };
  useEffect(() => {
    if (isShowModal && editData) {
      form.setFieldsValue({
        ...editData,
      });
    } else {
      form.resetFields();
    }
  }, [editData, form, isShowModal]);
  const modelTitle = useMemo(() => {
    if (editData) {
      return '编辑组织';
    }
    return '添加组织';
  }, [editData]);
  return (
    <Modal
      title={modelTitle}
      visible={isShowModal}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      forceRender
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="name" label="名称" rules={rules.name}>
          <Input className="c-w-250" />
        </Form.Item>
        <Form.Item label="上级菜单" name="parentId">
          <TreeSelect
            className="c-w-250"
            treeData={menuTree}
            placeholder="选择上级菜单"
            allowClear
          />
        </Form.Item>
        <Form.Item name="orderNum" label="排序编号">
          <InputNumber className="c-w-250" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Add;
