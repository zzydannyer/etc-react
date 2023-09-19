/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/teacher/trainSys/addTrain/step1/_part/SelectStudent/Restore.tsx
 * @Description:恢复删除的学员或者添加更新的学员
 */
import * as React from 'react';
import type { FC, Key } from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Modal, Form, Input, Select, Row, Col, Space, Button, Table, message } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { hidePhone, hideIdCard } from '@/utils/util';
import {} from 'umi';
import {} from '@/commonServe';

interface RestoreProps {
  isShowSelectModel: boolean;
  setisShowSelectModel: (b: boolean) => void;
  selectedRows: StudentListInfo[];
  allStudentList: StudentListInfo[];
  setselectedRows: (s: StudentListInfo[]) => void;
}
const Restore: FC<RestoreProps> = (props) => {
  const { isShowSelectModel, setisShowSelectModel, setselectedRows, allStudentList, selectedRows } =
    props;

  const [selectedItems, setselectedItems] = useState<StudentListInfo[]>([]);

  const [showPhoneId, setshowPhoneId] = useState<number[]>([]);

  const [showidCardNoId, setshowidCardNoId] = useState<number[]>([]);

  /**创建table 并且分页、搜索联动 */
  const tableRef = useRef<ActionType>();

  /**
   * 重置搜索
   */
  const reset = useCallback(() => {
    if (tableRef.current && tableRef.current.reload) {
      tableRef.current.reload();
    }
  }, []);

  useEffect(() => {
    if (isShowSelectModel) {
      reset();
      setselectedItems(selectedRows);
    }
  }, [isShowSelectModel, reset, selectedRows]);

  const handleCancel = () => {
    setisShowSelectModel(false);
  };
  const handleOk = () => {
    setselectedRows(selectedItems);
    // if(selectedItems.length>10){
    //   message.error('最多选择10个车型')
    //   return
    // }
    // setselectedRows(selectedItems);
    setisShowSelectModel(false);
  };

  const selectedRowKeys = useMemo(() => {
    return selectedItems.map((item) => {
      return item.id;
    });
  }, [selectedItems]);
  /**
   * @description: 显示手机号 全
   * @param {number} id
   * @return {*}
   */
  const handleShowphone = useCallback(
    (id: number) => {
      if (showPhoneId.includes(id)) {
        const index = showPhoneId.findIndex((sid) => sid === id);
        const d = [...showPhoneId];
        d.splice(index, 1);
        setshowPhoneId(d);
        // showPhoneId.splice(arr.findIndex(item => item.id === data.id), 1)
      } else {
        setshowPhoneId((prve) => {
          return [...prve, id];
        });
      }
    },
    [showPhoneId],
  );

  const handleShowIdCard = useCallback(
    (id: number) => {
      if (showidCardNoId.includes(id)) {
        const index = showidCardNoId.findIndex((sid) => sid === id);
        const d = [...showidCardNoId];
        d.splice(index, 1);
        setshowidCardNoId(d);
        // showPhoneId.splice(arr.findIndex(item => item.id === data.id), 1)
      } else {
        setshowidCardNoId((prve) => {
          return [...prve, id];
        });
      }
    },
    [showidCardNoId],
  );

  const getTableData = async (
    p: StudentListInfo,
  ): Promise<Partial<RequestData<StudentListInfo>>> => {
    // const res = await TopicInfoServe.post_find_page({
    //   ...p,
    //   pageNum: p.current,
    //   pageSize: p.pageSize,
    // });
    // console.log('allStudentList',allStudentList)
    let list = allStudentList;
    let i: keyof StudentListInfo;
    for (i in p) {
      const a = i;
      if ((p[i] as any) && typeof p[i] === 'string') {
        list = list.filter((item) => {
          return item[a].toString().indexOf(p[a].toString()) > -1;
        });
      }
    }

    return {
      data: list,
      success: true,
      total: list.length,
    };
  };

  const columns: ProColumns<StudentListInfo>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '80px',
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      align: 'center',
      width: '100px',
      render: (v, record) => {
        return (
          <Space>
            <span>
              {showPhoneId.includes(record.id as number)
                ? record.mobilePhone
                : hidePhone(record.mobilePhone || '')}
            </span>
            <EyeFilled onClick={() => handleShowphone(record.id || -1)}></EyeFilled>
          </Space>
        );
      },
    },
    {
      title: '身份证',
      dataIndex: 'idCardNo',
      key: 'idCardNo',
      align: 'center',
      width: '100px',
      render: (v, record) => {
        return (
          <Space>
            <span>
              {showidCardNoId.includes(record.id as number)
                ? record.idCardNo
                : hideIdCard(record.idCardNo || '')}
            </span>
            <EyeFilled onClick={() => handleShowIdCard(record.id || -1)}></EyeFilled>
          </Space>
        );
      },
    },
    {
      title: '单位',
      dataIndex: 'company',
      key: 'company',
      align: 'center',
      width: '80px',
    },
  ];
  return (
    <Modal
      title="选择学员"
      visible={isShowSelectModel}
      onCancel={handleCancel}
      onOk={handleOk}
      getContainer={false}
      forceRender
      maskClosable={false}
      width={850}
      className="select-model"
    >
      <ProTable
        rowKey={(d)=>d.id}
        /**table ref */
        actionRef={tableRef}
        tableAlertRender={false}
        tableAlertOptionRender={false}
        rowSelection={{
          fixed: true,

          selectedRowKeys,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          onChange: (selectedRowKeys: Key[], sRow: StudentListInfo[]) => {
            // console.log(selectedRowKeys)
            // setselectedItems(sRow);
          },
          // 手动触发选择
          onSelect: (record, selected, _selectedRows, nativeEvent) => {
            if (selected) {
              setselectedItems((prve) => {
                const s = [...prve];
                s.push(record);
                return Array.from(new Set(s));
              });
            } else {
              setselectedItems((prve) => {
                const list = prve.filter((item) => {
                  return item.id !== record.id;
                });
                return list;
              });
            }
          },
          // 手动触发全选
          onSelectAll: (selected, _selectedRows, changeRows) => {
            // /**全选 */
            if (selected) {
              setselectedItems((prve) => {
                const s = [...prve].concat(changeRows);
                return Array.from(new Set(s));
              });
            } else {
              const vehicleModelSeqList = changeRows.map((item) => {
                return item.id;
              });
              setselectedItems((prve) => {
                const list = prve.filter((item) => {
                  return !vehicleModelSeqList.includes(item.id);
                });
                return list;
              });
            }
          },
        }}
        columns={columns}
        // scroll={{ x: 800 }}
        tableStyle={{
          padding: 0,
        }}
        /**数据查询 */
        request={getTableData}
        /**搜索表单的配置 */
        search={{
          /**lab长度 */
          labelWidth: 'auto',
          /**配置查询表单的列数	 */
          span: {
            xs: 24,
            sm: 24,
            md: 8,
            lg: 8,
            xl: 6,
            xxl: 6,
          },
          /**自定义收起按钮 */
          collapseRender: () => {
            return <></>;
          },
          /**默认是否收起	 */
          defaultCollapsed: false,
          /**是否收起 */
          collapsed: false,
          /**自定义操作栏 */
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        options={false}
        bordered
        pagination={{
          defaultPageSize: 10,
        }}
        // dataSource={removeStudentList}
        // {...tableProps}
      />
    </Modal>
  );
};
export default Restore;
