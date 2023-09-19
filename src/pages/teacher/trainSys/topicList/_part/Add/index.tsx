import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import type { DataNode } from 'rc-tree-select/lib/interface';
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
  Space,
  Button,
  TreeSelect,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { rules } from './rules';
import { useFormGetFieldsValue } from '@/hooks';
import type { ItemObj, AddItem, SaveTopicOptionDTO } from '../../topicList.interface';
import { TopicInfoServe } from '@/commonServe';
import { getLetterArr } from '@/utils/util';
import type { CommonModelState } from '@/models/commonModel.interface';

/**26个大写英文 */
const letterArr = getLetterArr();

const { Option } = Select;
const { TextArea } = Input;

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
  commonState: CommonModelState;
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const Add: FC<AddProps> = (props) => {
  const { isShowModal, setisShowModal, reset, editData, commonState } = props;
  const [form] = Form.useForm<AddItem>();
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);
  /** 静态信息*/
  const { commonStaticInfo } = commonState;
  const { T_COURSE_INFO, T_TOPIC_INFO } = commonStaticInfo;
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
    form.submit();
  };
  /**添加 */
  const handleSaveUser = (values: AddItem) => {
    const p = {
      ...values,
      saveTopicOptionDTOList: values.saveTopicOptionDTOList.map((item) => {
        return {
          ...item,
          isAnswer: item.isAnswer ? 1 : 0,
        };
      }),
    };

    setconfirmLoading(true);
    TopicInfoServe.post_save(p).then((res) => {
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
  const handleUpdate = (values: AddItem) => {
    const p = {
      ...values,
      saveTopicOptionDTOList: values.saveTopicOptionDTOList.map((item) => {
        return {
          ...item,
          isAnswer: item.isAnswer ? 1 : 0,
        };
      }),
    };
    // 编辑 需要手动修改
    if (editData) {
      p.id = editData.id;
    }
    setconfirmLoading(true);
    TopicInfoServe.post_update(p).then((res) => {
      setconfirmLoading(false);
      if (res.code === 200) {
        message.success('修改成功');

        reset();
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
  const onFinish = (values: AddItem) => {
    Modal.confirm({
      title: '确认提交吗？',
      onOk: () => {
        if (editData) {
          handleUpdate(values);
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
      const { topicOptionDetailVOList } = editData;
      const list = topicOptionDetailVOList
        ? topicOptionDetailVOList.map((item) => {
            return {
              ...item,
              isAnswer: item.isAnswer === 1,
            };
          })
        : [];
      upDateFormValues({
        ...editData,
        saveTopicOptionDTOList: list,
      });
    } else {
      form.resetFields();
    }
  }, [editData, isShowModal, form, upDateFormValues]);

  const modelTitle = useMemo(() => {
    if (editData) {
      return '编辑题目';
    }
    return '新增题目';
  }, [editData]);

  /**选择题型 */
  const handleChangeType = (value: number) => {
    if (value === 1) {
      /**单选题 */
      upDateFormValues({
        saveTopicOptionDTOList: [
          {
            optionId: 'A',
            optionContent: '',
            isAnswer: true,
          },
        ],
      });
    } else if (value === 2) {
      /**多选题 */
      upDateFormValues({
        saveTopicOptionDTOList: [
          {
            optionId: 'A',
            optionContent: '',
            isAnswer: false,
          },
        ],
      });
    } else if (value === 3) {
      /**判断题 */
      upDateFormValues({
        saveTopicOptionDTOList: [
          {
            optionId: 'A',
            optionContent: '对',
            isAnswer: true,
          },
          {
            optionId: 'B',
            optionContent: '错',
            isAnswer: false,
          },
        ],
      });
    }
  };

  /**单选变化 */
  const handleChangeRadio = (checked: boolean, index: number) => {
    const saveTopicOptionList = formValues?.saveTopicOptionDTOList || [];
    const list: SaveTopicOptionDTO[] = saveTopicOptionList.map((item, i) => {
      if (i !== index) {
        return {
          ...item,
          isAnswer: false,
        };
      }
      return {
        ...item,
        isAnswer: true,
      };
    });
    upDateFormValues({
      saveTopicOptionDTOList: list,
    });
  };

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
      width={560}
    >
      <Form
        {...layout}
        onValuesChange={onValuesChange}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={22}>
            <Form.Item name="courseType" label="课程分类" rules={rules.courseType}>
              <TreeSelect
                treeData={T_COURSE_INFO as DataNode[]}
                placeholder="请选择课程分类"
                allowClear
              ></TreeSelect>
            </Form.Item>
            <Form.Item name="type" label="题型" rules={rules.type}>
              <Select onChange={handleChangeType} placeholder="请选择">
                {T_TOPIC_INFO &&
                  T_TOPIC_INFO.map((v, i) => {
                    return (
                      <Option key={v.value} value={v.value}>
                        {v.label}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item name="content" label="题干内容" rules={rules.content}>
              <TextArea placeholder="请输入题干内容" maxLength={500} showCount />
            </Form.Item>
            {/* 单选题 */}
            {formValues?.type === 1 && (
              <Form.List name="saveTopicOptionDTOList">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0
                          ? layout
                          : {
                              labelCol: { span: 0 },
                              wrapperCol: { span: 14, offset: 8 },
                            })}
                        label={index === 0 ? '选项' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Space>
                          <Form.Item
                            {...field}
                            key={`${index}1`}
                            validateTrigger={['onChange']}
                            name={[field.name, 'isAnswer']}
                            fieldKey={[field.fieldKey, 'isAnswer']}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox
                              onChange={(e) => {
                                handleChangeRadio(e.target.value, index);
                              }}
                              style={{ width: '10%' }}
                            ></Checkbox>
                            {/* <Radio.Group onChange={(e)=>{
                              handleChangeRadio(e.target.value,index)
                            }} >
                              <Radio value={1}></Radio>
                            </Radio.Group> */}
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index}2`}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: '请输入选项ID',
                              },
                            ]}
                            name={[field.name, 'optionId']}
                            fieldKey={[field.fieldKey, 'optionId']}
                            noStyle
                          >
                            <Input disabled style={{ width: '38px',textAlign:'center' }} />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: '请填写选项内容',
                              },
                            ]}
                            name={[field.name, 'optionContent']}
                            fieldKey={[field.fieldKey, 'optionContent']}
                            noStyle
                          >
                            <Input style={{ width: '163px' }} placeholder="选项内容" />
                          </Form.Item>

                          {fields.length - 1 === index ? (
                            <>
                              {index<25&& <PlusCircleOutlined
                                onClick={() =>
                                  add({
                                    optionId: letterArr[index + 1],
                                    optionContent: '',
                                    isAnswer: false,
                                  })
                                }
                              />}

                              {index > 0 && (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => remove(field.name)}
                                />
                              )}
                            </>
                          ) : null}
                        </Space>
                      </Form.Item>
                    ))}
                  </>
                )}
              </Form.List>
            )}
            {/* 多选题 */}
            {formValues?.type === 2 && (
              <Form.List name="saveTopicOptionDTOList">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0
                          ? layout
                          : {
                              labelCol: { span: 0 },
                              wrapperCol: { span: 14, offset: 8 },
                            })}
                        label={index === 0 ? '选项' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Space>
                          <Form.Item
                            {...field}
                            key={`${index}1`}
                            validateTrigger={['onChange']}
                            name={[field.name, 'isAnswer']}
                            fieldKey={[field.fieldKey, 'isAnswer']}
                            valuePropName="checked"
                            rules={[
                              {
                                required: true,
                                message: '至少有一个选项',
                                validator: (rule, value) => {
                                  const s = formValues.saveTopicOptionDTOList?.filter((v) => {
                                    return v.isAnswer === true;
                                  });
                                  if (s?.length === 0) {
                                    return Promise.reject(new Error('至少选择一个选项'));
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                            noStyle
                          >
                            <Checkbox style={{ width: '10%' }}></Checkbox>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index}2`}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: '请输入选项ID',
                              },
                            ]}
                            name={[field.name, 'optionId']}
                            fieldKey={[field.fieldKey, 'optionId']}
                            noStyle
                          >
                            <Input disabled style={{ width: '38px',textAlign:'center' }} />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: '请填写选项内容',
                              },
                            ]}
                            name={[field.name, 'optionContent']}
                            fieldKey={[field.fieldKey, 'optionContent']}
                            noStyle
                          >
                            <Input style={{ width: '163px' }} placeholder="选项内容" />
                          </Form.Item>

                          {fields.length - 1 === index ? (
                            <>
                              {index<25&&<PlusCircleOutlined
                                onClick={() =>
                                  add({
                                    optionId: letterArr[index + 1],
                                    optionContent: '',
                                    isAnswer: false,
                                  })
                                }
                              />}
                              {index > 0 && (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => remove(field.name)}
                                />
                              )}
                            </>
                          ) : null}
                        </Space>
                      </Form.Item>
                    ))}
                  </>
                )}
              </Form.List>
            )}
            {/* 判断题 */}
            {formValues?.type === 3 && (
              <Form.List name="saveTopicOptionDTOList">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0
                          ? layout
                          : {
                              labelCol: { span: 0 },
                              wrapperCol: { span: 14, offset: 8 },
                            })}
                        label={index === 0 ? '选项' : ''}
                        required={true}
                        key={field.key}
                      >
                        <Space>
                          <Form.Item
                            {...field}
                            key={`${index}1`}
                            validateTrigger={['onChange']}
                            name={[field.name, 'isAnswer']}
                            fieldKey={[field.fieldKey, 'isAnswer']}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox
                              onChange={(e) => {
                                handleChangeRadio(e.target.value, index);
                              }}
                              style={{ width: '10%' }}
                            ></Checkbox>
                          </Form.Item>

                          <Form.Item key={`${index}2`} noStyle>
                            {formValues.saveTopicOptionDTOList &&
                              formValues?.saveTopicOptionDTOList[index].optionContent}
                          </Form.Item>
                        </Space>
                      </Form.Item>
                    ))}
                  </>
                )}
              </Form.List>
            )}

            {/* <Form.Item name="contactPhone" label="联系人电话" rules={rules.contactPhone}>
              <Input />
            </Form.Item> */}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Add;
