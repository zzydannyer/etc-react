import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  TreeSelect,
  Space,
  Tooltip,
  InputNumber,
  message,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { rules } from './reles';
import type { Item, AddForm } from '../../menu.interface';
import { treeInterface } from '../../menu.interface';
import type { DataNode } from 'rc-tree-select/lib/interface';
import { SysServe } from '@/commonServe';
// import MenuTree from '@/pages/sys/role/_part/MenuTree';
const { Option } = Select;

interface AddProps {
  isShowAdd: boolean;
  setisShowAdd: (b: boolean) => void;
  submit: () => void;
  changeMenu?: Item; // 点击编辑的对象
  dataSource: Item[]; // 所有的数据
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const getChildTree = (list: Item[]) => {
  const tree: DataNode[] = [];
  // console.log(list)
  list.map((item: Item) => {
    if (item.name !== '首页') {
      tree.push({
        title: item.name,
        value: item.id,
        children: getChildTree(item.children),
      });
    }
  });

  return tree;
};
const radioOptions = [
  { label: '目录', value: 0 },
  { label: '菜单', value: 1 },
  { label: '按钮', value: 2 },
];
const tooltipContent = {
  urlTooltip: (
    <div>
      <p>URL格式：</p>
      <p>
        1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。
      </p>
      <p>
        2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。
      </p>
      <p>
        示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000
      </p>
    </div>
  ),
  iconTooltip: (
    <div>
      <p>
        推荐使用
        <a href="https://www.iconfont.cn/">Iconfont阿里巴巴矢量图标库</a>
      </p>
    </div>
  ),
};
const Add: FC<AddProps> = (props) => {
  const { isShowAdd, setisShowAdd, changeMenu, dataSource, submit } = props;
  const [form] = Form.useForm<AddForm>();
  const [radioValue, setradioValue] = useState<number>(); // 菜单类型
  const handleCancel = () => {
    setisShowAdd(false);
  };
  const handleOk = () => {
    form.submit();
  };
  /**
   * @description: 是否是编辑
   * @param {*}
   * @return {*}
   */
  const isEdit = useMemo(() => {
    if (changeMenu) {
      return true;
    }
    return false;
  }, [changeMenu]);
  /**
   * @description: 提交
   * @param {*}
   * @return {*}
   */
  const onFinish = (values: AddForm) => {
    const obj = {
      ...values,
    };
    if (isEdit && changeMenu) {
      obj.id = changeMenu.id;
      SysServe.post_update_menu(obj).then((res) => {
        if (res.code === 200) {
          setisShowAdd(false);
          message.success('修改成功');

          submit();
        } else {
          message.error(res.msg);
        }
      });
      return;
    }
    SysServe.post_save_menu(obj).then((res) => {
      if (res.code === 200) {
        setisShowAdd(false);
        message.success('添加成功');

        submit();
      } else {
        message.error(res.msg);
      }
    });
  };

  const overlayStyle = {
    width: '500px',
    backgroundColor: '#fff',
    borderRadius: '5px',
  };
  /**
   * @description: 切换菜单类型
   * @param {*}
   * @return {*}
   */
  const handleChangeRadio = (v: number) => {
    setradioValue(v);
  };
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
        title: '顶级菜单',
        value: 0,
        children,
      },
    ];
  }, [dataSource]);

  /**
   * @description: 菜单名称
   * @param {*}
   * @return {*}
   */
  const typeLabel = useMemo(() => {
    if (radioValue === 0) {
      return '目录名称';
    }
    if (radioValue === 1) {
      return '菜单名称';
    }
    if (radioValue === 2) {
      return '按钮名称';
    }
  }, [radioValue]);
  /**
   * @description: 初始化赋值
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    if (changeMenu) {
      form.setFieldsValue({
        name: changeMenu.name,
        perms: changeMenu.perms,
        orderNum: changeMenu.orderNum,
        icon: changeMenu.icon,
        url: changeMenu.url,
        type: changeMenu.type,
        parentId: changeMenu.parentId,
      });
      setradioValue(changeMenu.type);
    } else {
      if (form && form.resetFields) {
        form.resetFields();
        form.setFieldsValue({
          type: 0,
        });
      }
      setradioValue(0);
    }
  }, [changeMenu, form]);

  return (
    <Modal
      title={changeMenu?.name}
      visible={isShowAdd}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      destroyOnClose={true}
      forceRender
    >
      {/* {JSON.stringify(changeMenu)} */}
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="type" label="菜单类型">
          <Radio.Group
            disabled={isEdit}
            onChange={(e) => {
              handleChangeRadio(e.target.value);
            }}
            options={radioOptions}
          />
        </Form.Item>

        <Form.Item name="name" label={typeLabel} rules={rules.name}>
          <Input className="c-w-250" placeholder="菜单名称" />
        </Form.Item>
        <Form.Item label="上级菜单" name="parentId">
          <TreeSelect
            className="c-w-250"
            treeData={menuTree}
            placeholder="选择上级菜单"
            allowClear
          />
        </Form.Item>
        {/* 菜单 按钮 */}
        {(radioValue === 2 || radioValue === 1) && (
          <>
            <Form.Item name="perms" label="授权标识">
              <Input
                className="c-w-250"
                placeholder="如:sys:user:add,sys:user:edit,sys:user:delete"
              />
            </Form.Item>
          </>
        )}

        {/* 目录 菜单 */}
        {(radioValue === 1 || radioValue === 0) && (
          <>
            <Form.Item name="url" label="菜单路由" rules={rules.url}>
              <Input className="c-w-250" placeholder="请填写路由" />
            </Form.Item>
            <Form.Item name="orderNum" label="排序编号" rules={rules.orderNum}>
              <InputNumber className="c-w-250" min={1} />
            </Form.Item>
            <Form.Item name="icon" label="菜单图标">
              <Input className="c-w-250" placeholder="请以antd-、fa-、evdata-开头" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default Add;
//  {/* <Tooltip
//           placement="top"
//           title={tooltipContent.urlTooltip}
//           overlayStyle={overlayStyle}
//         >
//           <InfoCircleOutlined className="c-margin-left-10" />
//         </Tooltip> */}
