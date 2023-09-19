import type { FC } from 'react';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector, history, Link } from 'umi';
import { Input, message, Pagination, Form } from 'antd';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable, useRequest, useInterval } from 'ahooks';
import { SmileOutlined } from '@ant-design/icons';
import { selectAll } from '@/models/commonModel';
import { StudentTrainInfoServe } from '@/commonServe';

import './index.less';

// !!!!!!!要确定现在学习的小节id是多少
interface CommunicateProps {
  currentSectionId: number | undefined; // 继续学习的小节id
  studentTrainId: number | undefined; // 学员培训记录id
  /**视频的实际高度 */
  videoHeight?: number | undefined;
}

interface Result {
  total: number;
  list: StudentMessage[];
}

// const getTableData =(
//   { current, pageSize }: PaginatedParams[0],
//   p: Params,
// ): Promise<Result> => {
//   return StudentTrainInfoServe.student_message_find_page({
//     pageSize,
//     pageNum: current,
//     sectionId:'5'
//   }).then((res) => {
//     if (res.code === 200) {
//       return {
//         total: res.data.total,
//         list: res.data.list,
//       };
//     }
//     return {
//       total: 0,
//       list: [],
//     };
//   });
// }

const defaultPageSize = 10;

const Communicate: FC<CommunicateProps> = (props) => {
  const { currentSectionId, studentTrainId, videoHeight } = props;

  /**学员交流信息 */
  // const [list, setlist] = useState<StudentMessage[]>();
  /**发送的信息 */
  const [msg, setmsg] = useState<string>();
  /**用户id */
  const [studentId, setstudentId] = useState<number>();
  /**学员交流信息 */
  const [stuMsg, setstuMsg] = useState<StudentMessage[]>();

  /**用于滚动滚动条（实时聊天） */
  const messagesEnd = useRef();

  const getTableData = ({ current, pageSize }: PaginatedParams[0], p: Params): Promise<Result> => {
    return StudentTrainInfoServe.student_message_find_page({
      pageSize,
      pageNum: current,
      sectionId: currentSectionId,
    }).then((res) => {
      if (res.code === 200) {
        return {
          total: res.data.total,
          list: res.data.list,
        };
      }
      return {
        total: 0,
        list: [],
      };
    });
  };

  // useAntdTable https://ahooks.js.org/zh-CN/hooks/table/use-antd-table
  const { data, loading, pagination, refresh } = useRequest(getTableData, {
    // defaultPageSize,
    paginated: true,
    // form,
    //  manual:true,
  });

  useInterval(() => {
    refresh();
  }, 10000);

  // const { pagination, dataSource } = tableProps;
  // const { submit, reset } = search;

  useEffect(() => {
    // if(currentSectionId){
    //   form.setFieldsValue({
    //     sectionId:currentSectionId
    //   })
    //   submit()
    // }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSectionId]);

  // 滚动到聊天界面的最低端（用于实时聊天）
  // const scrollToBottom = () => {
  //   if (messagesEnd) {
  //     const { scrollHeight } = messagesEnd.current; // 里面div的实际高度
  //     const height = messagesEnd.current.clientHeight; // 网页可见高度
  //     const maxScrollTop = scrollHeight - height;
  //     messagesEnd.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  //   }
  // };

  // 输入的信息
  const handleChange = (e: { target: { value: React.SetStateAction<string | undefined> } }) => {
    setmsg(e.target.value);
  };

  // 发送交流信息
  const sendMessage = () => {
    StudentTrainInfoServe.send_student_message({
      message: msg,
      sectionId: currentSectionId, //小节id
    }).then((res) => {
      if (res.code === 200) {
        message.success('发送成功');
        setmsg('');
        refresh();
      } else {
        message.error(res.msg);
      }
    });
  };

  const itemRender = (_current: any, type: string, originalElement: any) => {
    if (type === 'prev') {
      return <a>上一页</a>;
    }
    if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  };

  const handleKeyDown = (key: number)=>{
    console.log(key)
    if(key === 13){
      sendMessage()
    }
  }

  // // 页码发生变化
  // const onChange = useCallback((page: number, pageSize?: number) => {
  //   StudentTrainInfoServe.student_message_find_page({
  //     pageNum: page,
  //     pageSize,
  //     sectionId: currentSectionId,
  //   }).then((res) => {
  //     if (res.code === 200) {
  //       setstuMsg(res.data.list);
  //       settotalMsg(res.data.total);
  //     }
  //   });
  // }, [currentSectionId]);

  useEffect(() => {
    // scrollToBottom();
    // 获取当前用户信息
    StudentTrainInfoServe.get_user_info({}).then((res) => {
      if (res.code === 200) {
        setstudentId(res.data.id);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  const contentHeight = useMemo(() => {
    if (videoHeight) {
      return `${videoHeight - 66}px`;
    }
    return '250px';
  }, [videoHeight]);
  return (
    <div className="communicate" style={{ height: contentHeight }}>
      {/* 用于实时聊天 */}
      {/* <div className="content" ref={messagesEnd}>
        <div className="message">
          {communicationMsg?.map((v, i) => {
            return (
              <div key={v.studentMessageId}>
                <div className="time">{v.createTime}</div>
                <div className={['fx-row', v.studentId === studentId ? 'me' : 'other'].join(' ')}>
                  {v.studentId !== 1 && <div className="name">{v.studentName}：</div>}
                  <div className="word">{v.content}</div>
                  {v.studentId === 1 && <div className="name">：我</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      <div className="content">
        {data?.list.map((v, i) => {
          return (
            <div className="message fx-row" key={v.studentMessageId}>
              <div className="name">{v.studentId === studentId ? '我' : v.studentName}：</div>
              <div className="msgAndtime fx-column fx-1">
                <span className="msg">{v.content}</span>
                <span className="time">{v.createTime}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="page">
        <Pagination
          className="pagination"
          total={data?.total}
          itemRender={itemRender}
          showSizeChanger={false}
          showQuickJumper
          size="small"
          // defaultPageSize={10} // 按照默认10条分页
          {...(pagination as any)}
          // defaultCurrent={1}
          // total={pagination.total}
          // current={pagination.current}
          // onChange={pagination.onChange}
          //  onChange={handleChangePage}
        />
      </div>

      <div className="send">
        <Input
          value={msg}
          onChange={handleChange}
          className="input"
          onKeyUp={(e)=>{

            handleKeyDown(e.keyCode)
          }}
          suffix={
            <div>
              {/* <SmileOutlined />  */}
              <span> | </span>
              <span style={{ cursor: 'pointer' }} onClick={sendMessage}>

                发送
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
};
export default Communicate;
