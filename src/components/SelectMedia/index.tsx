/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/components/SelectMedia/index.tsx
 * @Description: 选择媒体 视频 课件
 */

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Form,
  Checkbox,
  Row,
  Col,
  Image,
  Space,
  Button,
  message,
  Card,
  Modal,
  Pagination,
  Table,
  Tooltip
} from 'antd';
import type { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { VideoServe } from '@/commonServe';
import './index.less';

const { Meta } = Card;

interface VideoInfo {
  /**封面 */
  coverUrl: string;
  /**	时长（秒） */
  duration: string;
  /**大小（字节） */
  size: string;
  /**大小（字节） */
  title: string;
  /**视频上传id */
  videoId: string;
  /**视频主键id */
  vodId: number;
}

interface ResultData {
  total: number;
  list: VideoInfo[];
}

interface SelectMediaProps {
  isShowSelectMedia: boolean;
  setisShowSelectMedia: (b: boolean) => void;
  handleSelectVideo: (v: string, videoTitle: string) => void;
  selectVideoId?: string;
}

const defaultPageSize = 12;
const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Params,
): Promise<ResultData> => {
  return VideoServe.post_vod_info_find_page({
    pageSize,
    pageNum: current,
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

const SelectMedia: FC<SelectMediaProps> = (props) => {
  const { setisShowSelectMedia, isShowSelectMedia, handleSelectVideo, selectVideoId } = props;
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize,
    manual: true,
  });
  /**选择的视频 */
  const [checkValue, setcheckValue] = useState<string[]>([]);
  const { submit, reset } = search;

  const { pagination, dataSource } = tableProps;
  const handleCancel = () => {
    setisShowSelectMedia(false);
  };

  /**选中的视频名称 */
  const videoTitle = useMemo(() => {
    let str = '';
    if (checkValue.length > 0 && dataSource.length > 0) {
      // str =
      const currentVideo = dataSource.filter((item) => {
        return item.videoId === checkValue[0];
      });
      str = currentVideo.length > 0 ? currentVideo[0].title : '';
    }
    return str;
  }, [checkValue, dataSource]);

  const handleOk = () => {
    handleSelectVideo(checkValue.length > 0 ? checkValue[0] : '', videoTitle);
    setisShowSelectMedia(false);
  };
  /**提交 */
  const handleClickCheckBox = (v: string) => {
    setcheckValue([v]);
  };
  useEffect(() => {
    console.log(112233, '选择------');
    if (!isShowSelectMedia) {
      setcheckValue([]);
    }
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowSelectMedia]);

  useEffect(() => {
    if (selectVideoId) {
      setcheckValue([selectVideoId]);
    }
  }, [selectVideoId]);

  return (
    <>
      <Modal
        title="选择视频"
        visible={isShowSelectMedia}
        onCancel={handleCancel}
        onOk={handleOk}
        getContainer={false}
        forceRender
        maskClosable={false}
        destroyOnClose={true}
        width={700}
        className="c-select-media"
      >
        <Checkbox.Group style={{ width: '100%' }} value={checkValue}>
          <Row gutter={[16, 16]}>
            {dataSource &&
              dataSource.map((item) => {
                return (
                  <Col key={item.videoId} span={6}>
                    <Card
                      hoverable
                      onClick={() => {
                        handleClickCheckBox(item.videoId);
                      }}
                      style={{ width: '140px' }}
                      cover={
                        <div className="c-select-media-card">
                          <Checkbox
                            className="c-select-media-card-check"
                            value={item.videoId}
                            //  defaultChecked={selectVideoId === item.videoId}
                          ></Checkbox>
                          <img
                            style={{ width: '140px', height: '78px' }}
                            alt="example"
                            src={item.coverUrl}
                          />
                        </div>
                      }
                    >
                      <Meta
                        title={
                           <Tooltip placement="topLeft" title={item.title}>
  {item.title}
  </Tooltip>
                        }
                        description={
                          <>
                            <div className="c-select-media-card-tag">大小：{item.size}</div>
                            <div>时长：{item.duration}</div>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Checkbox.Group>
        <Table
          className="noTable"
          columns={[
            {
              title: 'name',
              dataIndex: 'name.last',
            },
          ]}
          rowKey="email"
          {...tableProps}
        />
        {/* <Pagination
          className="c-select-media-pagination"
          defaultPageSize={12}
          {...pagination}
          onChange={(page: number, pageSize: number) => {
            console.log(page);
            // getTableData({ current: page, pageSize }, {});
            pagination.current = page;
            submit({ pageNum: page, pageSize: 12 });
          }}
        /> */}
      </Modal>
    </>
  );
};
export default SelectMedia;
