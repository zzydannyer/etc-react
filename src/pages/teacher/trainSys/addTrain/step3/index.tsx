/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step3/index.tsx
 * @Description:考试设置
 */

import * as React from 'react';
import type { FC } from 'react';
import { history, useSelector } from 'umi';
import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Space, Button, message, Select, InputNumber, Table } from 'antd';
import { TrainInfoServe, ExamPaperInfoServe } from '@/commonServe';
import { useFormGetFieldsValue } from '@/hooks';
import type { ColumnsType } from 'antd/lib/table';
import { selectAll } from '@/models/commonModel';
import { rules } from './rule';
import type { TrainExamForm } from './step3.interface';
import AddExam from './_part/AddExam';

const { Option } = Select;
const { TextArea } = Input;

interface Step3Props {}
const Step3: FC<Step3Props> = (props) => {
  const { location } = history;
  const { commonState } = useSelector(selectAll);
  const { pathname, query } = location;
  const [form] = Form.useForm<TrainExamForm>();
  const { formValues, upDateFormValues, onValuesChange, resetForm } = useFormGetFieldsValue(form);
  /**试卷下拉列表 */
  const [examPaperList, setexamPaperList] = useState<ExamPaperBaseInfo[]>([]);
  //**操作（1：保存 2：发布） */
  const [operation, setoperation] = useState<1 | 2>();
  /**选择的试卷的详情 */
  const [examPaperDetial, setexamPaperDetial] = useState<ExamPaperDetail>();
  /**试试显示新增 编辑 试卷 */
  const [isShowModal, setisShowModal] = useState<boolean>(false);
  /**提交 */
  const onFinish = () => {
    TrainInfoServe.post_update_exam({
      ...formValues,
      id: query?.id,
      operation,
    }).then((res) => {
      if (res.code === 200) {
        if (operation === 1) {
          message.success('保存成功');
        } else {
          message.success('发布成功');
        }
        history.replace({
          pathname: '/teacher/trainSys/addTrain/step4',
          query: {
            id: query?.id || '',
            operation: operation?.toString() || '',
          },
        });
      } else {
        message.error(res.msg);
      }
    });
  };
  /**新增试卷 */
  const handleAddExam = () => {
    upDateFormValues({
      examPaperId: undefined,
    });
    setexamPaperDetial(undefined);
    setisShowModal(true);
  };

  const handleQueryComboBox = () => {
    ExamPaperInfoServe.get_query_combo_box().then((res) => {
      if (res.code === 200) {
        setexamPaperList(res.data);
      }
    });
  };

  /**获取试卷下拉列表 */
  useEffect(() => {
    handleQueryComboBox();
  }, []);

  const handlePrev = () => {
    history.replace({
      pathname: `/teacher/trainSys/addTrain/step2`,
      query: { id: query?.id || '' },
    });
  };
  /**
   * @description: 获取试卷详情
   * @param {number} _examPaperId
   * @return {*}
   */
  const getExamInfo = (_examPaperId: number) => {
    ExamPaperInfoServe.get_find_by_id({ examPaperId: _examPaperId }).then((res) => {
      if (res.code === 200) {
        setexamPaperDetial(res.data);
      }
    });
  };

  /**
   * @description: 编辑试卷
   * @param {number} _examPaperId
   * @return {*}
   */
  const handleEditExam = (_examPaperId: number) => {
    setisShowModal(true);
  };

  /**选择试卷触发 */
  useEffect(() => {
    if (formValues?.examPaperId && !isShowModal) {
      getExamInfo(formValues?.examPaperId);
    }
  }, [formValues?.examPaperId, isShowModal]);

  /**初始化获取之前的信息 */
  useEffect(() => {
    if (query?.id) {
      TrainInfoServe.get_find_by_id({ id: query.id }).then((res) => {
        if (res.code === 200) {
          // settrainDetial(res.data);
          if (res.data.examPaperId > 0) {
            upDateFormValues({
              answerTime: res.data.answerTime,
              examPaperId: res.data.examPaperId,
              notice: res.data.notice,
              maxExamTimes: res.data.maxExamTimes,
              passingScore: res.data.passingScore,
            });
          }
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [query, upDateFormValues]);

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
      dataIndex: 'typeName',
      key: 'typeName',
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
  ];

  const isCanEdit = useMemo(() => {
    if (examPaperList && formValues?.examPaperId) {
      const cobj = examPaperList.find((item) => {
        return item.examPaperId === formValues?.examPaperId;
      });
      return cobj && cobj.canUpdate === 1;
    }
    return false;
  }, [formValues?.examPaperId, examPaperList]);

  return (
    <>
      <div className="add-train-step">
        {/* {JSON.stringify(formValues)} */}
        {/* {operation} */}
        {/* 新增 编辑试卷 */}
        <AddExam
          setisShowModal={setisShowModal}
          isShowModal={isShowModal}
          commonState={commonState}
          editData={examPaperDetial}
          handleQueryComboBox={handleQueryComboBox}
        ></AddExam>
        <Form
          className="add-train-step-form"
          name="basic"
          onValuesChange={onValuesChange}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item required label="选择试卷">
            <Space>
              <Form.Item noStyle name="examPaperId" rules={rules.examPaperId}>
                <Select placeholder="请选择试卷" className="c-w-300" allowClear={true}>
                  {examPaperList.map((item) => {
                    return (
                      <Option key={item.examPaperId} value={item.examPaperId}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Button type="primary" onClick={handleAddExam}>
                新增试卷
              </Button>
            </Space>
          </Form.Item>
          {examPaperDetial?.examPaperId && (
            <>
              <Form.Item label="试卷名称">
                <Space>
                  <span> {examPaperDetial.name}</span>
                  {isCanEdit && (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        handleEditExam(examPaperDetial.examPaperId);
                      }}
                    >
                      编辑试卷
                    </Button>
                  )}
                </Space>
              </Form.Item>
              <Form.Item label="试卷分数">
                共 {examPaperDetial.subjectVOList.length} 题；共 {examPaperDetial.totalScore} 分
              </Form.Item>
              <Form.Item label="试卷详情">
                <Table
                  size="small"
                  rowKey="name"
                  columns={columns}
                  childrenColumnName="subjectTopicVOList"
                  // rowSelection={{ ...rowSelection, checkStrictly }}
                  dataSource={examPaperDetial.subjectVOList}
                ></Table>
              </Form.Item>
            </>
          )}
          <Form.Item label="及格分数" name="passingScore" rules={rules.passingScore}>
            <InputNumber
              className="c-w-300"
              min={0}
              max={examPaperDetial?.totalScore || 100}
              placeholder={examPaperDetial?.totalScore?`小于${examPaperDetial?.totalScore}分`:'请输入及格分数'}
            ></InputNumber>
          </Form.Item>
          <Form.Item label="答题时间(分钟)" name="answerTime" rules={rules.answerTime}>
            <InputNumber
              className="c-w-300"
              min={0}
              max={500}
              placeholder="请输入答题时间"
            ></InputNumber>
          </Form.Item>
          <Form.Item label="可考次数" name="maxExamTimes" rules={rules.maxExamTimes}>
            <InputNumber
              className="c-w-300"
              min={0}
              max={50}
              placeholder="请输入可考次数"
            ></InputNumber>
          </Form.Item>
          <Form.Item label="考试须知" name="notice" rules={rules.notice}>
            <TextArea className="c-w-300" maxLength={500} showCount></TextArea>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
            <Space style={{ marginTop: '20px' }}>
              <Button
                type="dashed"
                onClick={() => {
                  handlePrev();
                }}
              >
                上一步
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setoperation(1);
                  form.submit();
                }}
              >
                保存培训
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setoperation(2);
                  form.submit();
                }}
              >
                发布培训
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default Step3;
