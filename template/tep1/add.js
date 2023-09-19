const dirName = process.argv[2];
function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(' ');
  return string;
}
const addTep = `
import * as React from 'react';
import type { FC} from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Radio,
  Typography,
  Checkbox,
  DatePicker,
} from 'antd';
import { rules } from './rules';
import {useFormGetFieldsValue} from '@/hooks'
import type { ItemObj,AddItem } from '../../${dirName}.interface';
import { BaseInfoServe } from '@/commonServe';
import type { CommonModelState } from '@/models/commonModel.interface';
import moment from 'moment';
import type {Moment} from 'moment'

const { Option } = Select;

interface AddProps {
  /**是否显示编辑或者新增 */
  isShowModal: boolean;
  /**设置显示编辑或者新增 */
  setisShowModal: (b: boolean) => void;
  /**重新刷新搜索栏 */
  reset: () => void;
  /**编辑的内容 */
  editData?: ItemObj;
  /**公共状态信息 */
  commonState: CommonModelState
}
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const sexList = [
  {
    key: 0,
    value: '男',
  },
  {
    key: 1,
    value: '女',
  },
];

const Add: FC<AddProps> = props => {
  const { isShowModal, setisShowModal, reset, editData, commonState } = props;
  const [form] = Form.useForm<AddItem>();
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);
  /** 静态信息*/
  const { commonStaticInfo } = commonState;
  const {vehTypeMap} = commonStaticInfo;
  /**自定义hook 动态的获取表单中的值 */
  const { formValues, onValuesChange, upDateFormValues } = useFormGetFieldsValue<AddItem>(form);
  const handleCancel = () => {
    setisShowModal(false);
  };
  /**
   * @description: 提交
   * @param {type}
   * @return {type}
   */
  const handleOk = () => {
    console.log(form.getFieldsValue());
    form.submit();
  };
  const handleSaveUser = (values: AddItem) => {
    const p = {
      ...values,
    };

    setconfirmLoading(true);
    BaseInfoServe.post_stationInfo_save(p).then(res => {
      setconfirmLoading(false);
      if (res.code === 200) {

          message.success('添加成功');


        reset();
        handleCancel();
      } else {
        message.error(res.msg);
      }
    });
  };
  /**
   * @description: 修改
   * @param {*}
   * @return {*}
   */
  const handleUpdate= (values: AddItem)=>{
    const p = {
      ...values,
    };
    // 编辑 需要手动修改
    if (editData) {
      p.id = editData.id;
    }
    setconfirmLoading(true);
    BaseInfoServe.post_stationInfo_update(p).then(res => {
      setconfirmLoading(false);
      if (res.code === 200) {

          message.success('修改成功');

        reset();
        handleCancel();
      } else {
        message.error(res.msg);
      }
    });
  }
  /**
   * @description: 校验完成
   * @param {type}
   * @return {type}
   */
  const onFinish = (values: AddItem) => {
    console.log(values);
    Modal.confirm({
      title: '确认提交吗？',
      onOk: () => {
        if (editData) {
          handleUpdate(values)
        } else {
          handleSaveUser(values);
        }

      },
    });
  };
  /**
   * @description: 如果是编辑则赋值给form表单
   * @param {*}
   * @return {*}
   */
   useEffect(() => {
    if (isShowModal && editData) {
      upDateFormValues({
        ...editData,
        firstOperationTime: moment(editData.firstOperationTime),
      });
    } else {
      form.resetFields();
    }
  }, [editData, isShowModal, form, upDateFormValues]);

  const modelTitle = useMemo(() => {
    if (editData) {
      return '编辑加氢站信息';
    }
    return '新增加氢站信息';
  }, [editData]);



  return (
    <Modal
      title={modelTitle}
      visible={isShowModal}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      forceRender
      confirmLoading={confirmLoading}
      maskClosable={false}
      width={780}
    >
      <Form {...layout} onValuesChange={onValuesChange} form={form} name="control-hooks" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="stationName"
              label="加氢站名称"
              rules={rules.stationName}
            >
              <Input className="c-w-200" />
            </Form.Item>
            <Form.Item
              name="stationNo"
              label="加氢站编号"
              rules={rules.stationNo}
            >
              <Input className="c-w-200" />
            </Form.Item>
            <Form.Item
              name="stationType"
              label="加氢站类型"
              rules={rules.stationType}
            >
              <Select className="c-w-200" placeholder="请选择">
                {sexList &&
                  sexList.map((v, i) => {
                    return (
                      <Option key={i} value={v.key}>
                        {v.value}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item name="contact" label="联系人" rules={rules.contact}>
              <Input className="c-w-200" />
            </Form.Item>
            <Form.Item
              name="contactPhone"
              label="联系人电话"
              rules={rules.contactPhone}
            >
              <Input className="c-w-200" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stationSubName"
              label="加氢站简称"
              rules={rules.stationSubName}
            >
              <Input className="c-w-200" />
            </Form.Item>

            <Form.Item
              name="contactEmail"
              label="联系邮箱"
              rules={rules.contactEmail}
            >
              <Input className="c-w-200" />
            </Form.Item>

            <Form.Item
              name="firstOperationTime"
              label="加氢站投入运营时间"
              rules={rules.firstOperationTime}
            >
              <DatePicker className="c-w-date-200" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Add;
`;

// export default addTep
module.exports = addTep;
