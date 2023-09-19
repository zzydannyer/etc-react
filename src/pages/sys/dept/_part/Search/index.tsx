/*
 * @Author: 陈明烽
 * @Date: 2021-04-06 16:57:59
 * @LastEditors: 陈明烽
 * @LastEditTime: 2021-04-06 17:31:25
 * @FilePath: \evdata-exam\src\pages\sys\dept\_part\Search\index.tsx
 * @Description: 描述
 */

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
  changeType: () => void;
  commonState: CommonModelState;
  setisShowModal: (s: boolean) => void;
}

const Search: React.FC<SearchProps> = (props) => {
  const { form, submit, changeType, reset, commonState, setisShowModal } = props;
  // const { examineList, platformList, batchDataList } = commonState;
  const [examineList, setexamineList] = useState<any[]>();
  const [platformList, setplatformList] = useState<any[]>();
  const [batchDataList, setbatchDataList] = useState<any[]>();
  return (
    <Form form={form}>
      <Row className="c-search" gutter={24}>
        <Col className="c-search-from" span={22}>
          <Form.Item className="c-form-label-120 " label="组织名称" name="orgName">
            <Input className="c-w-200" placeholder="请输入组织名称" />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item className="c-search-btn fr">
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setisShowModal(true);
                }}
              >
                新增
              </Button>
              {/* <Button
              type="primary"
              onClick={submit}
            >
              查询
            </Button> */}
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default Search;
