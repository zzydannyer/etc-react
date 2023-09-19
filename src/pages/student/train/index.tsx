import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useSelector, history } from 'umi';
import { Button, Space, Card, Result } from 'antd';
import type { MyTrainListInfo } from './index.interface';
import { StudentTrainInfoServe } from '@/commonServe';
import TrainCard from './_part/TrainCard';
import { selectAll } from '@/models/commonModel';
import { PageViewPro } from 'shevdc-component';
import './index.less';

const { CPageViewContent } = PageViewPro;

/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '我的培训',
    address: '/student/training',
  },
  {
    name: '培训列表',
  },
];

interface TrainProps {}
const Train: FC<TrainProps> = (props) => {
  const [list, setlist] = useState<MyTrainListInfo[]>([]);
  const [hasAjax, sethasAjax] = useState<boolean>(false);
  const { commonState } = useSelector(selectAll);
  const { EXAM_PASS } = commonState;
  useEffect(() => {
    sethasAjax(false);
    StudentTrainInfoServe.my_train_list({
      pageNum: 1,
      pageSize: 0, // 获取全部数据
    })
      .then((res) => {
        if (res.code === 200) {
          setlist(res.data?.list || []);
        }
      })
      .finally(() => {
        sethasAjax(true);
      });
  }, []);
  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
      <CPageViewContent>
        {list && list.length > 0 && hasAjax && (
          <div className="train">
            <div className="content">
              {/* 获取数据以后循环遍历，并且把培训列表传给子组件 */}
              {list &&
                list.map((v, i) => {
                  return (
                    <>
                      <TrainCard EXAM_PASS={EXAM_PASS} list={v} key={v.trainId + i} />
                    </>
                  );
                })}
            </div>
          </div>
        )}
        {hasAjax && list.length === 0 && <Result title="暂无培训内容" />}
      </CPageViewContent>
    </PageViewPro>
  );
};
export default Train;
