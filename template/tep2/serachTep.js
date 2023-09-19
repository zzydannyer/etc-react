const dirName = process.argv[2];
function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(' ');
  return string;
}
const serachTep = `
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space, DatePicker } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import type { CommonModelState } from '@/models/commonModel.interface';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchProps {
  /**查询的form表单 */
  form: FormInstance;
  /**触发查询 */
  submit: () => void;
  /**重置查询信息 */
  reset: () => void;
  /**公共的state */
  commonState: CommonModelState;
  /**设置显示新增弹框 */
  setisShowModal: (s: boolean) => void;
}
const dateFormat = 'YYYY-MM-DD';
const Search: React.FC<SearchProps> = props => {
  const { form, submit, reset, commonState, setisShowModal } = props;
  /** 静态信息*/
  const { commonStaticInfo } = commonState;

  return (
    <Form form={form}>
      <Row className="c-search" gutter={24}>
        <Col className="c-search-from" span={22}>
          <Form.Item
            className="c-form-label-100 "
            label="加氢站名称"
            name="stationName"
          >
            <Input className="c-w-250" placeholder="请输入加氢站名称" />
          </Form.Item>
          <Form.Item
            className=" c-form-label-150"
            label="加氢站简称"
            name="stationSubName"
          >
            <Input className="c-w-250" placeholder="请输入加氢站简称" />
          </Form.Item>

        </Col>
        <Col span={2}>
          <Form.Item className="c-search-btn fr">
            <Space>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setisShowModal(true);
                }}
              >
                新增
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
      <Row className="c-search">
        <Col className="c-search-from" span={18}>
        <Form.Item className=" c-form-label-100" label="创建日期" name="date">
            <RangePicker className="c-date-w-250"  />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item className="c-search-btn fr">
            <Space>
              <Button type="primary" onClick={submit}>
                查询
              </Button>
              <Button onClick={reset}>清空</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default Search;

`;
module.exports = serachTep;
