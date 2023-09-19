/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step2/index.tsx
 * @Description: 课程选择
 */
import * as React from 'react';
import type { FC } from 'react';
import { history, useSelector } from 'umi';
import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Space, Button, Select, message, Table } from 'antd';
import { useFormGetFieldsValue } from '@/hooks';
import { CourseInfoServe, TrainInfoServe } from '@/commonServe';
import { selectAll } from '@/models/commonModel';
import AddCourse from './_part/AddCourse';

const { Option } = Select;

interface SaveSaveTrainStep2 {
  courseId: number;
}

const columns = [
  {
    title: '章节',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '介绍',
    dataIndex: 'description',
    key: 'age',
    width: '200px',
  },
  {
    title: '学时(分钟)',
    dataIndex: 'duration',
    key: 'duration',
  },
];

interface Step2Props {}
const Step2: FC<Step2Props> = (props) => {
  const { commonState } = useSelector(selectAll);
  const { location } = history;
  const { pathname, query } = location;
  const [form] = Form.useForm<SaveSaveTrainStep2>();
  const { formValues, onValuesChange, upDateFormValues, resetForm } = useFormGetFieldsValue(form);
  /**是否显示编辑或者新增 */
  const [isShowModal, setisShowModal] = useState<boolean>(false);
  /**课程列表 */
  const [comboBoxList, setcomboBoxList] = useState<ComboBox[]>([]);
  /**选择的课程详情 */
  const [courseDetail, setcourseDetail] = useState<CourseDetail>();
  /**培训详情 */
  const [trainDetial, settrainDetial] = useState<TrainDetial>();
  /**课程是否可编辑 */
  // const [isCanEdit, setisCanEdit] = useState<boolean>(false);

  const isCanEdit = useMemo(() => {
    if (comboBoxList && formValues?.courseId) {
      const cobj = comboBoxList.find((item) => {
        return item.courseId === formValues?.courseId;
      });
      return cobj && cobj.canUpdate === 1;
    }
    return false;
  }, [formValues?.courseId, comboBoxList]);

  /**提交 */
  const onFinish = () => {
    TrainInfoServe.post_update_course({
      id: trainDetial?.id,
      courseId: formValues?.courseId,
    }).then((res) => {
      if (res.code === 200) {
        message.success('修改成功');
        history.push({
          pathname: '/teacher/trainSys/addTrain/step3',
          query: {
            id: query?.id || '',
          },
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  const handlePrev = () => {
    history.replace({
      pathname: `/teacher/trainSys/addTrain/step1`,
      query: { id: query?.id || '' },
    });
  };

  /**查询课程下拉框 */
  const handleQueryComboBox = () => {
    CourseInfoServe.get_query_combo_box().then((res) => {
      if (res.code === 200) {
        setcomboBoxList(res.data);
      } else {
        message.error(res.msg);
      }
    });
  };
  /**获取课程列表 */
  useEffect(() => {
    handleQueryComboBox();
  }, []);

  /**
   * @description: 获取课程详情
   * @param {number} courseId
   * @return {*}
   */
  const getCourseInfo = (courseId: number) => {
    CourseInfoServe.get_course_info({ courseId }).then((res) => {
      if (res.code === 200) {
        setcourseDetail(res.data);
      } else {
        message.error(res.msg);
      }
    });
  };

  /**选择不同课程 */
  useEffect(() => {
    if (formValues?.courseId) {
      getCourseInfo(formValues?.courseId);
    } else {
      setcourseDetail(undefined);
    }
  }, [formValues?.courseId, isShowModal]);

  /**添加课程 */
  const handleAddCourse = () => {
    resetForm();
    setcourseDetail(undefined);
    setisShowModal(true);
  };
  /**编辑课程 */
  const handleEditCourse = (id: number) => {
    setisShowModal(true);
  };
  /**关闭弹出的时候 获取最新的课程列表 */
  useEffect(() => {
    if (!isShowModal) {
      handleQueryComboBox();
    }
  }, [isShowModal]);

  useEffect(() => {
    if (query?.id) {
      TrainInfoServe.get_find_by_id({ id: query.id }).then((res) => {
        if (res.code === 200) {
          settrainDetial(res.data);
          if (res.data.courseId > 0) {
            upDateFormValues({
              courseId: res.data.courseId,
            });
          }
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [query, upDateFormValues]);
  /**
   * @description: 手动选择题目
   * @param {number} _courseId
   * @return {*}
   */
  const upDataCourseId = (_courseId: number)=>{
    upDateFormValues({
      courseId:_courseId
    })
  }

  return (
    <div className="add-train-step">
      {/* {JSON.stringify(formValues)} */}
      {/* 编辑 或者 新增课程 */}
      <AddCourse
        commonState={commonState}
        handleQueryComboBox={handleQueryComboBox}
        setisShowModal={setisShowModal}
        editData={courseDetail}
        isShowModal={isShowModal}
        upDataCourseId={upDataCourseId}
      ></AddCourse>
      <Form
        className="add-train-step-form"
        name="basic"
        form={form}
        onValuesChange={onValuesChange}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        preserve={false}
        onFinish={onFinish}
      >
        <Form.Item required label="选择课程">
          <Space>
            <Form.Item
              noStyle
              name="courseId"
              rules={[{ type: 'number', required: true, message: '请选择课程' }]}
            >
              <Select placeholder="请选择课程" className="c-w-300" allowClear={true}>
                {comboBoxList.map((item) => {
                  return (
                    <Option key={item.courseId} value={item.courseId}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Button type="primary" onClick={handleAddCourse}>
              新增课程
            </Button>
          </Space>
        </Form.Item>
        {courseDetail && courseDetail.courseId && (
          <>
            <Form.Item label="课程名称">
              <Space>
                <span> {courseDetail.name}</span>
                {isCanEdit && (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      handleEditCourse(courseDetail.courseId);
                    }}
                  >
                    编辑课程
                  </Button>
                )}
              </Space>
            </Form.Item>
            <Form.Item label="课程分类">{courseDetail.typeName}</Form.Item>
            <Form.Item label="章节">
              <Table
                size="small"
                rowKey="name"
                columns={columns}
                childrenColumnName="sectionVOList"
                // rowSelection={{ ...rowSelection, checkStrictly }}
                dataSource={courseDetail.chapterVOList}
              ></Table>
            </Form.Item>
          </>
        )}

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Space>
            <Button
              type="dashed"
              onClick={() => {
                handlePrev();
              }}
            >
              上一步
            </Button>
            <Button type="primary" htmlType="submit">
              下一步
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Step2;
