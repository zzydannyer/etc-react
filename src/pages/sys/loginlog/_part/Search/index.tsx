import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import type { CommonModelState } from '@/models/commonModel.interface';

const { Option } = Select;
interface SearchProps {
  form: FormInstance;
  submit: () => void;
  reset: () => void;
  commonState: CommonModelState;
}

const Search: React.FC<SearchProps> = (props) => {
  const { form, submit, reset, commonState } = props;

  return (
    <Form form={form}>
      <Row className="c-search" gutter={24}>
        <Col className="c-search-from" span={18}>
          <Form.Item className="c-form-label-60 " label="用户名" name="userName">
            <Input className="c-w-200" placeholder="请输入用户名" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item className="c-search-btn fr">
            <Space>
              <Button type="primary" onClick={submit}>
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default Search;
