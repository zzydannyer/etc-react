/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step1/_part/SelectStudent/index.tsx
 * @Description:自定义form表单 选择学生
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { StudentInfoServe } from '@/commonServe';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { hidePhone, hideIdCard } from '@/utils/util';
import Restore from './Restore';

interface SelectStudentProps {
  value?: number[];
  onChange?: (list: number[]) => void;
  /**学生列表 */
  studentList: StudentListInfo[];
  /**培训id */
  _id?: string;
}

const SelectStudent: FC<SelectStudentProps> = (props) => {
  const { onChange, value, studentList, _id } = props;
  /**所有可选的用户信息 */
  const [allStudentList, setallStudentList] = useState<StudentListInfo[]>([]);
  /**选中的 */
  const [selectStudentList, setselectStudentList] = useState<StudentListInfo[]>([]);
  /**显示新增学生 */
  const [isShowSelectModel, setisShowSelectModel] = useState<boolean>(false);

  const [showPhoneId, setshowPhoneId] = useState<number[]>([]);

  const [showidCardNoId, setshowidCardNoId] = useState<number[]>([]);
  /**获取所有用户 或者之前选中的项目 */
  useEffect(() => {
    if (_id) {
      // setallStudentList(studentList);
      setselectStudentList(studentList)
    } else {
      StudentInfoServe.post_findPage_student({
        firstTrainStatus: 1,
        status: 1,
        pageNum: -1,
      }).then((res) => {
        if (res.code === 200) {
          setallStudentList(res.data.list);
          setselectStudentList(res.data.list)
        }
      });
    }
  }, [_id, studentList]);

  /**
   * @description: 所有的学生列表发生变化的时候赋值
   * @param {*}
   * @return {*}
   */
  // useEffect(() => {
  //   setselectStudentList(allStudentList);
  // }, [allStudentList]);
  /**
   * @description: 去除的学生列表
   * @param {*} useMemo
   * @return {*}
   */
  const removeStudentList = useMemo(() => {
    const selectStudentIdList = selectStudentList.map((item) => {
      return item.id;
    });
    const arr: StudentListInfo[] = [];
    allStudentList.map((item) => {
      if (!selectStudentIdList.includes(item.id)) {
        arr.push(item);
      }
    });
    return arr;
  }, [allStudentList, selectStudentList]);

  /**修改form表单数据 */
  const setchange = useCallback(
    (list: StudentListInfo[]) => {
      if (onChange) {
        onChange(
          list.map((item) => {
            return item.id;
          }),
        );
      }
    },
    [onChange],
  );

  // useEffect(() => {
  //   if (_id) {
  //     /**编辑培训 */
  //     setselectStudentList(studentList);
  //   } else {
  //     /**新增培训 */
  //     setselectStudentList(allStudentList || []);
  //   }
  // }, [allStudentList, studentList, _id]);

  useEffect(() => {
    setchange(selectStudentList);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectStudentList]);

  /**
   * @description: 添加学生
   * @param {*}
   * @return {*}
   */
  const handleAddSelect = (selectItem: StudentListInfo[])=>{

    setselectStudentList((prve) =>{
      return [
        ...prve,
        ...selectItem
      ]
    });
  }

  /**删除某一个 */
  const handleDel = useCallback(
    (id: number) => {
      const fData = selectStudentList.filter((item) => {
        return item.id !== id;
      });

      setselectStudentList(fData);
      // setchange(fData);
    },
    [selectStudentList],
  );

  /**
   * @description: 显示手机号 全
   * @param {number} id
   * @return {*}
   */
  const handleShowphone = useCallback(
    (id: number) => {
      if (showPhoneId.includes(id)) {
        const index = showPhoneId.findIndex((sid) => sid === id);
        const d = [...showPhoneId];
        d.splice(index, 1);
        setshowPhoneId(d);
        // showPhoneId.splice(arr.findIndex(item => item.id === data.id), 1)
      } else {
        setshowPhoneId((prve) => {
          return [...prve, id];
        });
      }
    },
    [showPhoneId],
  );

  const handleShowIdCard = useCallback(
    (id: number) => {
      if (showidCardNoId.includes(id)) {
        const index = showidCardNoId.findIndex((sid) => sid === id);
        const d = [...showidCardNoId];
        d.splice(index, 1);
        setshowidCardNoId(d);
        // showPhoneId.splice(arr.findIndex(item => item.id === data.id), 1)
      } else {
        setshowidCardNoId((prve) => {
          return [...prve, id];
        });
      }
    },
    [showidCardNoId],
  );
  /**
   * @description: 选择学员弹框
   * @param {*}
   * @return {*}
   */
  const handelToSelect =()=>{
    StudentInfoServe.post_findPage_student({
      firstTrainStatus: 1,
      status: 1,
      pageNum: -1,
    }).then((res) => {
      if (res.code === 200) {

        setallStudentList([...res.data.list,
          ...studentList
        ]);

        // if (_id){
        //   setallStudentList([...res.data.list,{
        //     ...studentList
        //   }]);
        // }else{
        //   setallStudentList(res.data.list);
        // }
        setisShowSelectModel(true)
      }
    });
    // if (!_id){
    //   // setisShowSelectModel(true)
    //   StudentInfoServe.post_findPage_student({
    //     firstTrainStatus: 1,
    //     status: 1,
    //     pageNum: -1,
    //   }).then((res) => {
    //     if (res.code === 200) {
    //       setallStudentList(res.data.list);
    //       setisShowSelectModel(true)
    //     }
    //   });
    // }else{
    //   setisShowSelectModel(true)
    // }
  }

  const handelDelAll = ()=>{
    if(onChange){
      onChange([])
      setselectStudentList([])
    }
  }

  const columns: ColumnsType<StudentListInfo> = useMemo(() => {
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: '200px',
      },
      {
        title: '手机号',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
        align: 'center',
        width: '200px',
        render: (v, record) => {
          return (
            <Space>
              <span>
                {showPhoneId.includes(record.id as number)
                  ? record.mobilePhone
                  : hidePhone(record.mobilePhone || '')}
              </span>
              <EyeFilled onClick={() => handleShowphone(record.id || -1)}></EyeFilled>
            </Space>
          );
        },
      },
      {
        title: '身份证',
        dataIndex: 'idCardNo',
        key: 'idCardNo',
        align: 'center',
        width: '180px',
        render: (v, record) => {
          return (
            <Space>
              <span>
                {showidCardNoId.includes(record.id as number)
                  ? record.idCardNo
                  : hideIdCard(record.idCardNo || '')}
              </span>
              <EyeFilled onClick={() => handleShowIdCard(record.id || -1)}></EyeFilled>
            </Space>
          );
        },
      },
      {
        title: '单位',
        dataIndex: 'company',
        key: 'company',
        align: 'center',
        width: '150px',
      },
      {
        title: '操作',
        width: '100px',
        key: 'x',
        align: 'center',
        render: (v, _) => (
          <Button
            onClick={() => {
              handleDel(_.id);
            }}
            type="link"
          >
            去除
          </Button>
        ),
      },
    ];
  }, [handleDel, handleShowIdCard, handleShowphone, showPhoneId, showidCardNoId]);

  return (
    <div>
       <Space>
        <Button onClick={handelToSelect} >+选择学员</Button>

        <Button type='link' onClick={handelDelAll}>全部去除</Button>
        </Space>
      {/* {JSON.stringify(removeStudentList)} */}
      <Restore
        selectedRows={selectStudentList}
        setselectedRows={setselectStudentList}
        setisShowSelectModel={setisShowSelectModel}
        isShowSelectModel={isShowSelectModel}

        allStudentList={allStudentList}
      />
      <p></p>
      <Table
        size="small"
        rowKey="id"
        pagination={{ defaultPageSize:5 }}
        bordered
        dataSource={selectStudentList}
        columns={columns}
      />

    </div>
  );
};
export default SelectStudent;
