import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Button, Select, message, Row, Col } from 'antd';
import { useFormGetFieldsValue } from '@/hooks';
import type { ItemObj, AddItem } from '../../studentList.interface';
import type { CommonModelState } from '@/models/commonModel.interface';
import type { UpdateInfo } from './UpdateStu.interface';

const UpdateStu = (props: UpdateInfo) => {
  const { isShowModal, setisShowModal } = props;
  // /**
  //  * @description: 修改
  //  * @param {*}
  //  * @return {*}
  //  */
  // const handleUpdate = (values: AddItem) => {
  //   const p = {
  //     ...values,
  //   };
  //   // 编辑 需要手动修改
  //   if (editData) {
  //     p.id = editData.id;
  //   }
  //   setconfirmLoading(true);
  //   BaseInfoServe.post_stationInfo_update(p).then((res) => {
  //     setconfirmLoading(false);
  //     if (res.code === 200) {
  //       message.success('修改成功');

  //       reset();
  //       handleCancel();
  //     } else {
  //       message.error(res.msg);
  //     }
  //   });
  // };
  const updateNewStu = () => {
    setisShowModal(false);
  };
  const updateCurrentStu = () => {
    setisShowModal(false);
  };

  return (
    <div>
      <Modal
        title="同步学员信息"
        visible={isShowModal}
        onOk={updateNewStu}
        onCancel={updateCurrentStu}
        footer={[
          <Button onClick={updateNewStu} type="primary">
            仅同步新增学员
          </Button>,
          <Button onClick={updateNewStu}>更新现有学员信息</Button>,
        ]}
      >
        检查到有 100 条新增学员信息， 平台现有 1000 条学员信息， 可点击下方按钮进行同步。
      </Modal>
    </div>
  );
};

export default UpdateStu;
