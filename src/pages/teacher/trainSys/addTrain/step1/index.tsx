/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step1/index.tsx
 * @Description: 创建培训 - 基本信息
 */
import * as React from 'react';
import type { FC } from 'react';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import moment from 'moment';
import type {Moment} from 'moment'
import { Form, Input, DatePicker, Button, message } from 'antd';
import {} from 'ahooks';
import { TrainInfoServe } from '@/commonServe';
import { useFormGetFieldsValue } from '@/hooks';
import { rules } from './rule';
import type { SaveTrainBaseInfo, TrainBaseInfo } from './step1.interface';
import SelectStudent from './_part/SelectStudent';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface SZtep1Props {}

function disabledDate(current: Moment) {
  // Can not select days before today and today
  return current && current < moment().subtract(1,'days').endOf('day');
}
function range(start: number, end: number) {
  const result = [];
  for (let i = start; i < end; i+=1) {
    result.push(i);
  }
  return result;
}
// function disabledDateTime() {
//   return {
//     disabledHours: () => range(0, 24).splice(4, 20),
//   };
// }

const SZtep1: FC<SZtep1Props> = (props) => {
  const { location } = history;
  const { pathname, query } = location;
  const [form] = Form.useForm<SaveTrainBaseInfo>();
  const { formValues, onValuesChange, upDateFormValues, resetForm } = useFormGetFieldsValue(form);
  /**学生列表 */
  const [studentList, setstudentList] = useState<StudentListInfo[]>([]);
  /**
   * @description: 修改信息
   * @param {*}
   * @return {*}
   */
  const handleUpdateData = (data: Partial<TrainBaseInfo>) => {
    TrainInfoServe.post_update_base({
      ...data,
      id: query?.id,
    }).then((res) => {
      if (res.code === 200) {
        message.success('修改成功');
        history.push({
          pathname: '/teacher/trainSys/addTrain/step2',
          query: {
            id: query?.id || '',
          },
        });
      } else {
        message.error(res.msg);
      }
    });
  };
  /**新增数据 */
  const handleAddData = (data: Partial<TrainBaseInfo>) => {
    TrainInfoServe.post_save({
      ...data,
    }).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        history.push({
          pathname: '/teacher/trainSys/addTrain/step2',
          query: {
            id: res.data.id,
          },
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  /**提交 */
  const onFinish = () => {
    if(formValues?.studentIdList?.length===0){
      message.error('学员不能为空')
      return
    }
    const p: Partial<TrainBaseInfo> = {
      ...formValues,
      endTime:
        formValues?.trangeTime && formValues.trangeTime[1]
          ? `${formValues.trangeTime[1].format('YYYY-MM-DD HH')}:00:00`
          : '',
      startTime:
        formValues?.trangeTime && formValues.trangeTime[0]
          ? `${formValues.trangeTime[0].format('YYYY-MM-DD HH')}:00:00`
          : '',
    };
    if (query?.id) {
      handleUpdateData(p);
    } else {
      handleAddData(p);
    }
    // delete p.trangeTime;
  };

  useEffect(() => {
    setstudentList([]);
    if (query?.id) {
      TrainInfoServe.get_find_by_id({ id: query.id }).then((res) => {
        if (res.code === 200) {
          upDateFormValues({
            ...res.data,
            trangeTime: [moment(res.data.startTime), moment(res.data.endTime)],
            studentTrainVOList: [],
          });
          setstudentList(res.data.studentTrainVOList);
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [query, upDateFormValues]);

  return (
    <div className="add-train-step">
      {/* {JSON.stringify(formValues)} */}
      <Form
        className="add-train-step-form"
        name="basic"
        onValuesChange={onValuesChange}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item label="培训名称" name="name" rules={rules.name}>
          <Input placeholder="请输入培训名称" maxLength={80} className="c-w-400" />
        </Form.Item>
        <Form.Item label="培训起止时间" name="trangeTime" rules={rules.trangeTime}>
          <RangePicker
            showTime={{
              format: 'HH',
            }}
            disabledDate={disabledDate}
            disabledTime={(current)=>{
              return {
                disabledHours:() => {
                  if(current?.days()===moment().days()){
                    return range(0, moment().add(1,'hours').hours())

                  }
                  return []
                }
              }
            }}
            format="YYYY年MM月DD日HH时"
            className="c-date-w-400"
          ></RangePicker>
        </Form.Item>

        <Form.Item label="学员预览" name="studentIdList" required>
          <SelectStudent
            _id={query?.id as string | undefined}
            studentList={studentList}
          ></SelectStudent>
        </Form.Item>

        <Form.Item label="培训说明" name="description" rules={rules.description}>
          <TextArea rows={5} className="c-w-400" showCount maxLength={500}></TextArea>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SZtep1;
