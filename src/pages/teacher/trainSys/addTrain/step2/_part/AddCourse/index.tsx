/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step2/_part/AddCourse/index.tsx
 * @Description: 编辑 新建课程
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Form, Input, Space, Button, Select, message, Table, Modal, TreeSelect } from 'antd';
import type { DataNode } from 'rc-tree-select/lib/interface';
import { Icon } from 'shevdc-component';
import { useFormGetFieldsValue } from '@/hooks';
import { CourseInfoServe } from '@/commonServe';
import type { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';
import AddSection from '../AddSection';
import { rules } from './rule';
import './index.less';

interface CourseProps {
  editData?: CourseDetail;
  /**是否显示编辑或者新增 */
  isShowModal: boolean;
  /**设置显示编辑或者新增 */
  setisShowModal: (b: boolean) => void;
  /**重新查询课程列表 */
  handleQueryComboBox: () => void;
  /**公共状态信息 */
  commonState: CommonModelState;
  /**手动选择题目 */
  upDataCourseId: (s: number) => void;
}

const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

const Course: FC<CourseProps> = (props) => {
  const { editData, setisShowModal, isShowModal, handleQueryComboBox, commonState,upDataCourseId } = props;
  /** 静态信息*/
  const { commonStaticInfo } = commonState;
  const [form] = Form.useForm<CourseDetail>();
  const { formValues, onValuesChange, upDateFormValues, resetForm } = useFormGetFieldsValue(form);
  const { T_COURSE_INFO, T_TOPIC_INFO } = commonStaticInfo;
  /**是否提交中 */
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);

  /**章节信息列表 */
  const [chapterVOList, setchapterVOList] = useState<Chapter[]>([]);
  /**课程id */
  const [courseId, setcourseId] = useState<number>();
  /**修改的章id */
  const updataChapterId = useRef<number>();
  /**编辑的章节名称 */
  // const [chapterName, setchapterName] = useState<string>('zzz');
  const chapterName = useRef<string>('');
  /**是否显示添加 编辑小节 */
  const [isShowChapter, setisShowChapter] = useState<boolean>(false);
  /**编辑的小节的时候的章节信息 */
  const [chapterInfo, setchapterInfo] = useState<Chapter>();
  /**编辑的小节的信息 */
  const [editSection, seteditSection] = useState<Section>();
  // const [editChapter, seteditChapter] = useState<Section>();
  /**展开的章 */
  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);

  /**弹框title */
  const modelTitle = useMemo(() => {
    if (editData) {
      return '编辑课程';
    }
    return '新增课程';
  }, [editData]);

  const handleCancel = () => {
    setchapterVOList([]);
    setisShowModal(false);
  };

  /**
   * @description: 获取最新的 章列表
   * @param {number} _courseId 课程id
   * @return {*}
   */
  const handleGetCourseInfo = (_courseId?: number) => {
    if (_courseId) {
      setcourseId(_courseId);
    }
    CourseInfoServe.get_course_info({ courseId: _courseId || courseId }).then((res) => {
      if (res.code === 200) {
        setchapterVOList(res.data.chapterVOList);
      }
    });
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
   * @description: 校验完成
   * @param {type}
   * @return {type}
   */
  const onFinish = () => {
    CourseInfoServe.post_update_course({
      courseId,
      ...formValues,
    }).then((res) => {
      if (res.code === 200) {
        if (editData?.courseId) {
          message.success('修改成功');
          upDataCourseId(editData?.courseId)
        } else {
          upDataCourseId(courseId as number)
          message.success('新增成功');
        }
        setchapterVOList([]);
        resetForm();
        setisShowModal(false);

      } else {
        message.error(res.msg);
      }
    });
  };

  /**新增章节 */
  const saveÇhapter = () => {
    CourseInfoServe.post_save_chapter({
      //章节名称
      chapterName: chapterName.current,
      //课程id
      courseId: editData?.courseId || courseId || null,
      //课程名称
      name: formValues?.name || null,
      //课程分类
      type: formValues?.type || null,
    }).then((res) => {
      if (res.code === 200) {
        /**更新章节列表 */
        if (res.data && res.data.id) {
          handleGetCourseInfo(res.data.id);
        } else {
          handleGetCourseInfo();
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  /**添加章节 */
  const handleAddChapter = () => {
    chapterName.current = '';
    updataChapterId.current = undefined;
    Modal.confirm({
      title: '章节名称',
      icon: <></>,

      content: (
        <>
          <Input
            onChange={(e) => {
              chapterName.current = e.target.value;
              // setchapterName(e.target.value);
            }}
            maxLength={80}
            placeholder="请输入章节名称"
          ></Input>
        </>
      ),
      onOk: () => {
        if (chapterName.current.length === 0) {
          message.error('请输入章节名称');
          return Promise.reject(new Error('请输入章节名称'));
        }
        saveÇhapter();
      },
      onCancel: () => {},
    });
  };

  /**
   * @description: 删除小节
   * @param {number} sectionId
   * @return {*}
   */
  const handleDeleteSection = (sectionId: number, name: string) => {
    Modal.confirm({
      title: `确定删除${name}吗？`,
      onOk: () => {
        CourseInfoServe.post_delete_section({
          sectionId,
        }).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            handleGetCourseInfo();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  };

  /**
   * @description: 删除章节
   * @param {number} chapterId
   * @param {string} name
   * @return {*}
   */
  const handleDeleteChapter = (chapterId: number, name: string) => {
    Modal.confirm({
      title: `确定删除${name}吗？`,
      onOk: () => {
        CourseInfoServe.post_delete_chapter({
          chapterId,
        }).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            handleGetCourseInfo();
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  };
  /**更新章节名称 */
  const upDataÇhapter = () => {
    CourseInfoServe.post_update_chapter({
      //章节名称
      chapterName: chapterName.current,
      chapterId: updataChapterId.current,
    }).then((res) => {
      if (res.code === 200) {
        /**更新章节列表 */
        if (res.data && res.data.id) {
          handleGetCourseInfo(res.data.id);
        } else {
          handleGetCourseInfo();
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  /**
   * @description: 修改章节
   * @param {number} chapterId
   * @param {string} name
   * @return {*}
   */
  const handleEditChapter = (chapterId: number, name: string) => {
    updataChapterId.current = chapterId;
    chapterName.current = name;
    Modal.confirm({
      title: '修改章节名称',
      icon: <></>,

      content: (
        <>
          <Input
            defaultValue={chapterName.current}
            // value={chapterName.current}
            onChange={(e) => {
              chapterName.current = e.target.value;
              // setchapterName(e.target.value);
            }}
            maxLength={8}
            placeholder="请输入章节名称"
          ></Input>
        </>
      ),
      onOk: () => {
        if (chapterName.current.length === 0) {
          message.error('请输入章节名称');
          return Promise.reject(new Error('请输入章节名称'));
        }
        upDataÇhapter();
      },
      onCancel: () => {},
    });
  };
  /**
   * @description: 修改小节
   * @param {Section} _sectionInfo
   * @return {*}
   */
  const handleEditSection = (_sectionInfo: Section) => {
    seteditSection(_sectionInfo);
    setisShowChapter(true);
    // seteditChapter()
    // seteditChapter(sectionInfo)
  };

  /**
   * @description:新增小节
   * @param {Chapter} info
   * @return {*}
   */
  const handleAddSection = (info: Chapter) => {
    setchapterInfo(info);
    seteditSection(undefined);
    setisShowChapter(true);
  };
  /**
   * @description: 点击展开按钮
   * @param {*}
   * @return {*}
   */

  const handleExpand = (expanded: boolean, record: Chapter) => {
    if (!expanded) {
      setexpandedRowKeys([]);
      setchapterInfo(undefined);
    } else {
      setchapterInfo(record);
      setexpandedRowKeys([record.name]);
    }
  };

  useEffect(() => {
    if (editData) {
      /**如果是修改 */
      setchapterVOList(editData.chapterVOList);
      upDateFormValues({
        name: editData.name,
        type: editData.type,
      });
      setcourseId(editData.courseId);
    } else {
      /**如果是新增 */
      setchapterVOList([]);
      resetForm();
      setcourseId(undefined);
    }
  }, [editData, resetForm, upDateFormValues]);

  const columns: ColumnsType<Chapter> = [
    {
      title: '章节',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '150px',
    },
    {
      title: '介绍',
      dataIndex: 'description',
      key: 'age',
      width: '300px',
      align: 'center',
    },
    {
      title: '学时(分钟)',
      dataIndex: 'duration',
      width: '100px',
      key: 'duration',
      align: 'center',
    },
    {
      title: '操作',
      width: '200px',
      key: 'name',
      align: 'center',
      render: (value, record, index) => {
        return (
          <Space>
            <Button
              onClick={() => {
                if (value.sectionId) {
                  handleEditSection(value);
                } else {
                  handleEditChapter(value.chapterId, value.name);
                }
              }}
              size="small"
              type="link"
            >
              编辑
            </Button>
            <Button
              danger
              onClick={() => {
                // handleDeleteSection()
                if (value.sectionId) {
                  handleDeleteSection(value.sectionId, value.name);
                } else {
                  handleDeleteChapter(value.chapterId, value.name);
                }
              }}
              size="small"
              type="link"
            >
              删除
            </Button>
            {!value.sectionId && (
              <Button
                size="small"
                onClick={() => {
                  handleAddSection(value);
                }}
                type="link"
              >
                添加小节
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
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
      >
        {/* {JSON.stringify(formValues)} */}
        {/* <Icon type="fa-bug" /> */}
        {/* {chapterName} */}
        {/* 新增编辑小节 */}
        <AddSection
          isShowChapter={isShowChapter}
          setisShowChapter={setisShowChapter}
          chapterInfo={chapterInfo}
          editData={editSection}
          handleGetCourseInfo={handleGetCourseInfo}
        ></AddSection>
        <Form
          {...layout}
          onValuesChange={onValuesChange}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          preserve={false}
        >
          <Form.Item name="name" label="课程名称" rules={rules.name}>
            <Input className="c-w-300" maxLength={80} placeholder="请输入课程名称"></Input>
          </Form.Item>
          <Form.Item name="type" label="课程分类" rules={rules.courseType}>
            <TreeSelect
              className="c-w-300"
              treeData={T_COURSE_INFO as DataNode[]}
              placeholder="请选择课程分类"
              allowClear
            ></TreeSelect>
          </Form.Item>
          <Form.Item label="章节">
            <Button
              disabled={!formValues?.name || !formValues?.type}
              onClick={() => {
                handleAddChapter();
              }}
            >
              添加章节
            </Button>
          </Form.Item>
          <Form.Item label="章节">
            <Table
              size="small"
              rowKey="name"
              className="chapter-table"
              columns={columns}
              //展开的行，控制属性
              expandedRowKeys={expandedRowKeys}
              // 点击展开图标时触发
              onExpand={handleExpand}
              indentSize={25}
              pagination={false}
              childrenColumnName="sectionVOList"
              // rowSelection={{ ...rowSelection, checkStrictly }}
              dataSource={chapterVOList}
            ></Table>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Course;
