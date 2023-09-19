import * as React from 'react';
import type { Key, FC } from 'react';
import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { useSelector, Link, useDispatch, history } from 'umi';
import { Space, Button, message, Modal, Upload } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import type { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import type { FormInstance } from 'antd';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageViewPro } from 'shevdc-component';
import { hidePhone, hideIdCard } from '@/utils/util';
import { transformData, transformEnum } from '@/utils/util';
import { StudentInfoServe, get_temp_url } from '@/commonServe';
import type { StuFindPage, ItemObj, ItemObjDetil } from './studentList.interface';
import { selectAll } from '@/models/commonModel';
import EditStudent from './_part/EditStudent/index';
import Detail from '../Detail/index';

const { CPageViewContent } = PageViewPro;

interface StudentlistProps {}
/**面包屑信息 */
const linkRrouters: LinkRrouter[] = [
  {
    name: '学员管理',
  },
  {
    name: '学员列表'
  },
];
/**
 * @description: 表格查询数据 ProTable 中的 request 属性
 * @param {*}
 * @return {*}
 */
const getTableData = async (p: {
  pageSize?: number;
  current?: number;
  keyword?: string;
}): Promise<Partial<RequestData<StuFindPage>>> => {
  const res = await StudentInfoServe.post_findPage_student({
    ...p,
    pageNum: p.current,
    pageSize: p.pageSize,
  });
  return {
    data: res.code === 200 ? res.data.list : [],
    success: res.code === 200,
    total: res.code === 200 && res.data ? res.data.total : 0,
  };
};

const Studentlist: FC<StudentlistProps> = (props) => {
  const { commonState } = useSelector(selectAll);
  /**权限 */
  const { permissions } = commonState;
  /**是否显示编辑或者新增 */
  const [isShowModal, setisShowModal] = useState<boolean>(false);
  //
  const [status, setStatus] = useState<number>();
  /**创建table 并且分页、搜索联动 */
  const tableRef = useRef<ActionType>();
  /**搜索栏ref */
  const formRef = useRef<FormInstance<ItemObj>>();
  /**编辑的学生信息 */
  const [studentObj, setstudentObj] = useState<StuFindPage>();
  const [showPhoneId, setshowPhoneId] = useState<number[]>([]);
  /**
   * 重置搜索
   */
  const reset = useCallback(() => {
    if (tableRef.current && tableRef.current.reload) {
      tableRef.current?.reload();
    }
  }, []);

  const changeStuStatus = useCallback(async (id: number, operation: number) => {
    const res = await StudentInfoServe.post_updata_studentStatus({ id, operation });
    if (res.code === 200) {
      message.success('修改成功');
      formRef.current?.submit();
    } else {
      message.error('修改失败');
      tableRef.current?.reload();
    }
  }, []);
  /**
   * @description: 修改学员状态
   * @param {*}
   * @return {*}
   */
  const handleStuStatus = useCallback(
    (record: StuFindPage) => {
      Modal.confirm({
        title: `确定${record.status === 0 ? '启用' : '停用'}吗？`,
        onOk: () => {
          if (record.status === 0) {
            changeStuStatus(record.id, 1);
          }
          if (record.status === 1) {
            changeStuStatus(record.id, 0);
          }
        },
      });
    },
    [changeStuStatus],
  );
  /**
   * @description: 同步学员
   * @param {*}
   * @return {*}
   */
  const handleImport = () => {
    setisShowModal(true);
  };

  /**
   * @description: 显示手机号 全
   * @param {number} id
   * @return {*}
   */
  const handleShowphone = useCallback(
    (id: number) => {
      if (showPhoneId.includes(id)) {
        const index = showPhoneId.findIndex((_id) => _id === id);
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

  //表格信息
  const columns: ProColumns<StuFindPage>[] = useMemo(() => {
    return [
      {
        title: '序号',
        align: 'center',
        width: '70px',
        dataIndex: 'index',
        valueType: 'index',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: '200px',
        render: (value, record, index) => {
          return (
            <Button
              href={`/teacher/studentSys/Detail?id=${record.id.toString()}`}
              target="_blank"
              type="link"
            >
              {value}
            </Button>
          );
        },
      },
      {
        title: '手机',
        align: 'center',
        dataIndex: 'mobilePhone',
        fieldProps: (form, config) => {
          return {
            maxLength: 11,
            placeholder: '请输入',
          };
        },
        render: (text, record, index) => {
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
        align: 'center',
        dataIndex: 'idCardNo',
        render: (texr, record, index) => {
          return hideIdCard(record.idCardNo);
        },
      },
      {
        title: '创建时间',
        align: 'center',
        // valueType: 'dateRange',
        dataIndex: 'createTime',
        search: false,
      },
      {
        title: '更新时间',
        align: 'center',
        // valueType: 'dateRange',
        dataIndex: 'lastUpdateTime',
        search: false,
      },
      {
        title: '操作',
        dataIndex: 'orgSeq',
        align: 'center',
        search: false,
        width: '250px',
        render: (text, record, _) => {
          return (
            <Space>
              {permissions['business:student:edit'] && (
                <Button
                  onClick={() => {
                    setstudentObj(record);
                    setisShowModal(true);
                  }}
                  type="link"
                >
                  编辑
                </Button>
              )}

              {record.status === 0 && permissions['business:student:updateStatus'] && (
                <Button onClick={() => handleStuStatus(record)} type="link">
                  启用
                </Button>
              )}
              {record.status !== 0 && permissions['business:student:updateStatus'] && (
                <Button danger onClick={() => handleStuStatus(record)} type="link">
                  停用
                </Button>
              )}
            </Space>
          );
        },
      },
    ];
  }, [handleShowphone, handleStuStatus, permissions, showPhoneId]);

  /**
   * @description: 导入模板
   * @param {UploadChangeParam} info
   * @return {*}
   */
  const handleChange = (info: UploadChangeParam) => {
    const res = info.file.response;
    // setfileList(list);
    if (res) {
      if (res.code === 200) {
        message.success('导入成功');
        reset();
      } else {
        Modal.error({
          title:res.msg
        })
        // message.error(res.msg);
      }
    }
  };

  const handleDown = () => {
    get_temp_url({ fileUrl: 'excel/template/学员导入模板.xlsx' }).then((res) => {
      window.open(res.data);
      // window.location.href=res.data
    });
  };

  useEffect(() => {
    if (!isShowModal) {
      tableRef.current?.reload();
    }
  }, [isShowModal]);

  return (
    <PageViewPro linkRrouters={linkRrouters} paddingTop={40} paddingBottom={10}>
      <CPageViewContent>
        <ProTable
          rowKey="id"
          scroll={{ x: 1024 }}
          /**table ref */
          actionRef={tableRef}
          /**查询表单的ref */
          formRef={formRef}
          /**分页设置*/
          pagination={{
            defaultPageSize: 10,
          }}
          /**数据查询 */
          request={getTableData}
          /** */
          columns={columns}
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
            /**默认是否收起	 */
            defaultCollapsed: false,
            /**是否收起 */
            collapsed: false,
            /**自定义操作栏 */
            optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
          }}
          toolBarRender={() => [
            permissions['business:student:import'] && (
              <Upload
                action="/evdata-ets-api/api/studentInfo/importExcel"
                accept=".xlsx"
                headers={{
                  token: window.localStorage.getItem('token') || '',
                }}
                // fileList={[]}
                showUploadList={false}
                onChange={(info) => handleChange(info)}
                maxCount={1}
                key="z"
              >
                <Button>导入</Button>
              </Upload>
            ),
            permissions['business:student:import'] ? (
              <Button onClick={() => handleDown()} key="6" type="link">
                下载导入模板
              </Button>
            ) : null,
          ]}
          /**table 工具栏，设为 false 时不显示 */
          // options={false}
          /**转化 moment 格式数据为特定类型，false 不做转化 */
          dateFormatter="string"
          /**搜索之前进行一些修改 */
          beforeSearchSubmit={(parame) => {
            return parame;
          }}
          bordered
          tableStyle={{
            padding: 0,
          }}
        ></ProTable>
        <EditStudent
          isShowModal={isShowModal}
          studentObj={studentObj}
          setisShowModal={setisShowModal}
        />
      </CPageViewContent>
    </PageViewPro>
  );
};
export default Studentlist;
