import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Form, Input, Descriptions, message, Row, Col, Button } from 'antd';
import type { CommonModelState } from '@/models/commonModel.interface';
import type { ItemObjDetil } from '../../trainList.interface';

interface DetailProps {
  detailObj?: ItemObjDetil;
  isShowDetail: boolean;
  setisShowDetail: (s: boolean) => void;
  commonState: CommonModelState;
}
const Detail: FC<DetailProps> = (props) => {
  const { detailObj, isShowDetail, setisShowDetail, commonState } = props;
  const { commonStaticInfo } = commonState;

  const handleCancel = () => {
    setisShowDetail(false);
  };
  const handleOk = () => {};
  return (
    <Modal
      title={'详情'}
      visible={isShowDetail}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      forceRender
      maskClosable={false}
      width={780}
      className="c-detial"
      destroyOnClose={true}
      footer={null}
    >
      <Descriptions bordered column={2} size={'middle'}>
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
        <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
        <Descriptions.Item label="Official">$60.00</Descriptions.Item>
        <Descriptions.Item label="Config Info" span={2}>
          Data disk type: MongoDB
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
export default Detail;
