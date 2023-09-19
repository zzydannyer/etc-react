/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step3/_part/AddExam/index.tsx
 * @Description: 新增 编辑 试卷
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, Space, Button, Select, message, Table, Modal, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';
import { Icon } from 'shevdc-component';
import { ExamPaperInfoServe } from '@/commonServe';
import { useFormGetFieldsValue } from '@/hooks';
import AddSubject from '../AddSubject';
import SelectTopic from '../SelectTopic';

const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

interface AddExamProps {
  /**编辑试卷信息 */
  editData?: ExamPaperDetail;
  /**是否显示编辑或者新增 */
  isShowModal: boolean;
  /**设置显示编辑或者新增 */
  setisShowModal: (b: boolean) => void;
  /**重新查询试卷列表 */
  handleQueryComboBox: () => void;
  /**公共状态信息 */
  commonState: CommonModelState;
}
const AddExam: FC<AddExamProps> = (props) => {
  const { editData, setisShowModal, isShowModal, handleQueryComboBox, commonState } = props;

  const { commonStaticInfo } = commonState;
  const { T_COURSE_INFO, T_TOPIC_INFO } = commonStaticInfo;
  /**是否提交中 */
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm<ExamPaperDetail>();
  const { formValues, onValuesChange, upDateFormValues, resetForm } = useFormGetFieldsValue(form);
  /**试卷id */
  const [examPaperId, setexamPaperId] = useState<number>();
  /**大题列表 信息 */
  const [subjectVOList, setsubjectVOList] = useState<Subject[]>([]);
  /**试卷信息 */
  const [examPaper, setexamPaper] = useState<ExamPaperDetail>();
  /**是否显示 新增/编辑 大题 */
  const [isShowAddSubject, setisShowAddSubject] = useState<boolean>(false);
  /**展开的章 */
  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);
  /**编辑的小题的时候的大题信息 */
  const [subjectInfo, setsubjectInfo] = useState<Subject>();
  /**编辑的大题的信息 */
  const [editSubject, seteditSubject] = useState<Subject>();
  /**选择小题的时候 存储的大题的信息 */
  const [selectTopicSubjectInfo, setselectTopicSubjectInfo] = useState<Subject>();
  /**是否显示 选择题目 */
  const [isShowSelectTopic, setisShowSelectTopic] = useState<boolean>(false);
  /**编辑的小题的时候设置的分数 */
  const topicScore = useRef<string>('');
  const formRef = useRef<FormInstance<SubjectTopic>>();

  /**
   * @description: 选择 小题
   * @param {*}
   * @return {*}
   */
  const handleSelectTpic = (info: Subject) => {
    setselectTopicSubjectInfo(info);
    setisShowSelectTopic(true);
  };
  /**
   * @description: 编辑大题
   * @param {Subject} info
   * @return {*}
   */
  const handleEditSubject = (info: Subject) => {
    // console.log(info);
    seteditSubject(info);
    setisShowAddSubject(true);
  };
  /**
   * @description: 设置试卷的id 并且请求新的大题列表
   * @param {number} _examPaperId
   * @return {*}
   */
  const handleGetSubjectVOList = (_examPaperId?: number) => {
    /**有id则是新增大题 */
    if (_examPaperId) {
      setexamPaperId(_examPaperId);
    }
    ExamPaperInfoServe.get_find_by_id({ examPaperId: _examPaperId || examPaperId }).then((res) => {
      if (res.code === 200) {
        setsubjectVOList(res.data.subjectVOList);
        setexamPaper(res.data);
      }
    });
  };
  /**
   * @description: 删除大题
   * @param {Subject} info
   * @return {*}
   */
  const handleDeleteSubject = (info: Subject) => {
    Modal.confirm({
      title: `确定删除${info.name}吗？`,
      onOk: () => {
        ExamPaperInfoServe.post_delete_subject({
          subjectId: info.subjectId,
        }).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            handleGetSubjectVOList();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  };
  /**
   * @description: 删除小题
   * @param {SubjectTopic} info
   * @return {*}
   */
  const handleDeleteTopic = (info: SubjectTopic) => {
    Modal.confirm({
      title: `确定删除${info.content}吗？`,
      onOk: () => {
        ExamPaperInfoServe.post_deleteSubjectTopic({
          subjectTopicId: info.subjectTopicId,
        }).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            handleGetSubjectVOList();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  };
  /**
   * @description: 编辑小题的分数
   * @param {SubjectTopic} info
   * @return {*}
   */
  const handleEditTopic = (info: SubjectTopic) => {
    topicScore.current = info.score.toString();
    Modal.confirm({
      title: `修改“${info.content}”的分数`,
      icon: <></>,

      content: (
        <>
          <InputNumber<number>
            onChange={(v) => {
              topicScore.current = v ? v.toString() : '';
            }}
            value={Number(topicScore.current)}
            maxLength={80}
            className="c-w-200"
            placeholder="请输入小题分数"
          ></InputNumber>
        </>
      ),
      onOk: () => {
        if (topicScore.current.length > 0) {
          ExamPaperInfoServe.post_updateTopicScore({
            subjectTopicId: info.subjectTopicId,
            score: topicScore.current,
          }).then(() => {
            handleGetSubjectVOList();
          });
        }
        // console.log(chapterName)
      },
      onCancel: () => {
        // setchapterName('')
      },
    });
  };

  const handleCancel = () => {
    resetForm()
    handleQueryComboBox();
    setexamPaper(undefined)
    setexamPaperId(undefined)
    setisShowModal(false);
  };

  const handleOk = () => {
    form.submit();
  };

  const onFinish = () => {
    if(!examPaper){
      handleCancel()
      // message.error('请添加大题')
      return
    }
    ExamPaperInfoServe.post_updateExamPaper({
      examPaperId: examPaper?.examPaperId,
      name: formValues?.name,
    }).then((res) => {
      if (res.code === 200) {
        message.success('保存成功')
        handleCancel()
      }else{
        message.error(res.msg)
      }
    });
    // handleQueryComboBox();
    // handleCancel();
  };
  /**
   * @description: 点击展开按钮
   * @param {*}
   * @return {*}
   */
  const handleExpand = (expanded: boolean, record: Subject) => {
    if (!expanded) {
      setexpandedRowKeys([]);
      setsubjectInfo(undefined);
    } else {
      setsubjectInfo(record);
      setexpandedRowKeys([record.name]);
    }
  };

  /**
   * @description: 添加大题
   * @param {*}
   * @return {*}
   */
  const handleAddSubject = () => {
    seteditSubject(undefined);
    setisShowAddSubject(true);
  };

  /**关闭新增大题 */
  useEffect(() => {}, [isShowAddSubject]);

  /**弹框title */
  const modelTitle = useMemo(() => {
    if (editData) {
      return '编辑试卷';
    }
    return '新增试卷';
  }, [editData]);

  /**初始化数据 */
  useEffect(() => {
    if (isShowModal) {
      if (editData) {
        setsubjectVOList(editData.subjectVOList);
        setexamPaperId(editData.examPaperId);
        upDateFormValues({
          name: editData.name,
        });
        setexamPaper(editData);
      } else {
        setsubjectVOList([]);
        resetForm();
        setexamPaperId(undefined);
        setexamPaper(undefined);
      }
    }
  }, [editData, upDateFormValues, resetForm, isShowModal]);
  const columns: ColumnsType<Subject> = [
    {
      title: '试题题干',
      // dataIndex: 'name',
      // key: 'name',
      width: '200px',
      render: (value) => {
        if (value) {
          if (value.name) {
            return value.name;
          }
          return value.content;
        }
        return '';
      },
    },
    {
      title: '试题类型',
      dataIndex: 'topicTypeName',
      key: 'topicTypeName',
      width: '100px',
    },
    {
      title: '答案',
      // dataIndex: 'answer',
      // key: 'answer',
      render: (value, row) => {
        if (value.type === 3) {
          return value.answer === 'B' ? '错' : '对';
        }
        return value.answer;
      },
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: '操作',
      width: '200px',
      align: 'center',
      render: (value, record, index) => {
        return (
          <Space>
            {value.content && (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    handleEditTopic(value);
                  }}
                  type="link"
                >
                  编辑小题
                </Button>
                <Button onClick={() => handleDeleteTopic(value)} danger size="small" type="link">
                  删除
                </Button>
              </>
            )}

            {value.topicTypeName && (
              // 大题
              <>
                <Button onClick={() => handleEditSubject(value)} size="small" type="link">
                  编辑
                </Button>
                <Button onClick={() => handleSelectTpic(value)} size="small" type="link">
                  选择题目
                </Button>
                <Button onClick={() => handleDeleteSubject(value)} danger size="small" type="link">
                  删除
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];
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
      destroyOnClose={true}
      width={890}
      cancelText="关闭"
    >
      {/* 新增大题 */}
      <AddSubject
        isShowAddSubject={isShowAddSubject}
        setisShowAddSubject={setisShowAddSubject}
        editData={editSubject}
        examPaperName={formValues?.name || ''}
        T_TOPIC_INFO={T_TOPIC_INFO}
        examPaperId={examPaperId}
        handleGetSubjectVOList={handleGetSubjectVOList}
      ></AddSubject>
      {/* 选择小题 */}
      <SelectTopic
        isShowSelectTopic={isShowSelectTopic}
        setisShowSelectTopic={setisShowSelectTopic}
        T_COURSE_INFO={T_COURSE_INFO}
        T_TOPIC_INFO={T_TOPIC_INFO}
        selectTopicSubjectInfo={selectTopicSubjectInfo}
        handleGetSubjectVOList={handleGetSubjectVOList}
      ></SelectTopic>
      <Form
        {...layout}
        onValuesChange={onValuesChange}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item
          name="name"
          label="试卷名称"
          rules={[
            {
              required: true,
              type: 'string',
              message: '请输入试卷名称',
            },
          ]}
        >
          <Input className="c-w-300" maxLength={80} placeholder="请输入试卷名称"></Input>
        </Form.Item>
        <Form.Item required label="添加大题">
          <Space>
            <Button
              disabled={!formValues?.name}
              onClick={() => {
                handleAddSubject();
              }}
            >
              添加大题
            </Button>
            {examPaper?.totalScore && examPaper?.totalScore > 0 ? (
              <span>
                共 {examPaper.subjectVOList.length || 0} 题，共 {examPaper.totalScore} 分
              </span>
            ) : null}
          </Space>
        </Form.Item>
        <Table
          size="small"
          rowKey="name"
          className="subject-table"
          columns={columns}
          //展开的行，控制属性
          expandedRowKeys={expandedRowKeys}
          // 点击展开图标时触发
          onExpand={handleExpand}
          indentSize={25}
          pagination={false}
          childrenColumnName="subjectTopicVOList"
          // rowSelection={{ ...rowSelection, checkStrictly }}
          dataSource={subjectVOList}
        ></Table>
      </Form>
    </Modal>
  );
};
export default AddExam;
