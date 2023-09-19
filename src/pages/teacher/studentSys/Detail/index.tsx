import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { history,useSelector } from 'umi';
import { PageViewPro } from 'shevdc-component';
import { Table, Space, message, Descriptions, Typography, Row, Col, Button, Divider } from 'antd';
import type { CommonModelState } from '@/models/commonModel.interface';
import useUrlState from '@ahooksjs/use-url-state';
import type { ItemObj, StuFindPage, StudentTrainVO } from '../studentList/studentList.interface';
import type { ColumnsType } from 'antd/lib/table/interface';
import { hideIdCard, hidePhone } from '@/utils/util';
import { StudentInfoServe } from '@/commonServe';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { AnswerRecord } from '@/components';
import { selectAll } from '@/models/commonModel';
import './detail.less';

const { CPageViewContent } = PageViewPro;
const { Title } = Typography;
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '学员信息',
    address: '/OrginfoManager/studentList',
  },
];
interface DetailProps {
  showDetail: boolean;
  detailObj: StuFindPage | undefined;
  setShowDetail: (s: boolean) => void;
  setDetailObj: (s: StuFindPage) => void;
}
const Detail: FC<DetailProps> = (props) => {
  const [data, setData] = useState<ItemObj>();
  const { commonState } = useSelector(selectAll);
  const { permissions,EXAM_PASS } = commonState;
  /** 设置手机号和身份证号的显示状态，true为隐藏中间数字，false为不隐藏 */
  const [phoneStatus, setPhoneStatus] = useState<boolean>(true);
  const [idStatus, setIdStatus] = useState<boolean>(true);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [answerId, setAnswerId] = useState<number>();
  const { location } = history;
  /** 接收上一个页面传入的参数 */
  const detailObj = location.query;

  /**
   * @description: 获取学生详情信息
   * @param {*} useCallback
   * @return {*}
   */
  const getStuInfo = useCallback(async (id) => {
    const res = await StudentInfoServe.get_find_studentInfo({ id });
    if (res.code === 200) {
      setData(res.data);
    } else {
      message.error(res.msg);
    }
  }, []);
  useEffect(() => {
    if (detailObj?.id) {
      getStuInfo(detailObj.id);
    }
  }, [detailObj, getStuInfo]);
  /**
   * @description: 处理返回操作
   * @param {*}
   * @return {*}
   */
  const handleBack = () => {
    history.goBack();
  };
  /**
   * @description: 查看答题记录
   * @param {StudentTrainVO} record
   * @return {*}
   */
  const handleCheck = (record: StudentTrainVO) => {
    setAnswerId(record.studentTrainId);
    setShowAnswer(true);
  };
  const columns: ColumnsType<StudentTrainVO> = [
    {
      title: '培训名称',
      align: 'center',
      dataIndex: 'trainName',
    },
    {
      title: '起止时间',
      dataIndex: 'startTime',
      align: 'center',
    },
    {
      title: '是否通过',
      align: 'center',
      dataIndex: 'isExamPass',
      render: (text, recoder, index) => {
        return EXAM_PASS[recoder.isExamPass]
      },
    },
    {
      title: '最高成绩',
      align: 'center',
      dataIndex: 'score',
    },
    {
      title: '考试次数',
      align: 'center',
      dataIndex: 'examTimes',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => handleCheck(record)}>查看答题记录</a>
        </Space>
      ),
    },
  ];

  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
      <CPageViewContent className="studentList_detail">
        <AnswerRecord showAnswer={showAnswer} setShowAnswer={setShowAnswer} answerId={answerId} />
        <div>
          {/* <Divider orientation="left">
            <Title level={4}>查看学员</Title>
          </Divider> */}
          <Divider orientation="left">
            <Title level={5} style={{ margin: '10px 0 0 0' }}>
              学员资料
            </Title>
          </Divider>
          <div style={{ margin: '0 50px 0 100px' }}>
            <Descriptions bordered={false} size="default" column={2}>
              <Descriptions.Item label="姓名">{data?.name}</Descriptions.Item>
              <Descriptions.Item label="手机">
                {phoneStatus === true ? hidePhone(data?.mobilePhone || '') : data?.mobilePhone}
                <div style={{ margin: '2px 0 0 5px' }} onClick={() => setPhoneStatus(!phoneStatus)}>
                  <EyeFilled />
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="身份证">
                {idStatus === true ? hideIdCard(data?.idCardNo || '') : data?.idCardNo}
                <div style={{ margin: '2px 0 0 5px' }} onClick={() => setIdStatus(!idStatus)}>
                  <EyeFilled />
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="单位">{data?.company}</Descriptions.Item>
            </Descriptions>
          </div>
          <Divider orientation="left">
            <Title level={5}>培训记录</Title>
          </Divider>
          <div style={{ margin: '0 50px' }}>
            <Table columns={columns} dataSource={data?.studentTrainVOList} rowKey="trainId"></Table>
          </div>
          {/* <div style={{ textAlign: 'center', margin:'0 0 30px 0' }}>
            <Button onClick={handleBack} size={'large'}>
              返回
            </Button>
          </div> */}
        </div>
      </CPageViewContent>
    </PageViewPro>
  );
};
export default Detail;
