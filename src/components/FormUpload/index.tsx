/* eslint-disable no-restricted-properties */
/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/components/FormUpload/index.tsx
 * @Description: antd form上传文件
 */
import * as React from 'react';
import type { FC, ReactNode } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Form, Upload, Button, Modal, message, Image } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { get_temp_url } from '@/commonServe';
import { FormItemProps } from 'antd/lib/form/FormItem';
import type { UploadFile } from 'antd/lib/upload/interface';

export const accetpMap = {
  zip: 'application/zip,application/x-zip,application/x-zip-compressed',
  pdf: 'application/pdf',
  excel:
    'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  image: 'image/jpeg,image/bmp,image/png,image/gif,image/svg',
  word: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: '.csv',
  normal: 'image/jpeg,image/png',
  normalAndSvg: 'image/jpeg,image/png,image/svg+xml',
  ppt:'.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
};
interface FormUpLoadProps extends Omit<UploadProps, 'onchange' | 'accept'> {
  /** 其他upLoadprops */
  // uploadProps?: Omit<UploadProps,'onchange'>;
  /** sso存放的目录名称 */
  folder?: string; // folder 后台存放地址
  /** 数据发生变化 */
  onchange?: (url: string[]) => void; // 数据发生变化
  /** 原始的数据 */
  value?: string[];
  /** 图片的名称 */
  label: string;
  /**上传地址 */
  action: string;
  /** 上传类型 1：上传图片；2：上传word等 */
  // upLoadType: number; //
  // 限制上传类型
  acceptType?:
    | 'zip'
    | 'excel'
    | 'pdf'
    | 'image'
    | 'word'
    | 'csv'
    | 'normal'
    | 'normalAndSvg'
    |'ppt'
    | Partial<'zip' | 'excel' | 'pdf' | 'image' | 'word' | 'csv'|'ppt'>[];
  /** 文字说明 */
  extra?: string | ReactNode;
  // 限制大小 单位 M
  size?: number;
}
const getAccepts = (acpt: any) =>
  acpt &&
  // @ts-ignore：无法被执行的代码的错误
  (Array.isArray(acpt) ? acpt : [acpt]).map((item) => accetpMap[item]).join(',');

const FormUpLoad: FC<FormUpLoadProps> = (props) => {
  const {
    folder,
    children,
    onchange,
    value,
    label,
    // upLoadType,
    maxCount,
    extra,
    size,
    acceptType,
    action,
    ...restProps
  } = props;
  /** 上传文件 绝对路径地址 */
  const [fileList, setfileList] = useState<UploadFile[]>([]);
  /** 是否展示图片 */
  const [previewVisible, setpreviewVisible] = useState<boolean>(false);
  /** 展示的图片地址 */
  const [previewImage, setpreviewImage] = useState<string>('');
  // 大小限制
  const checkSize = (file: { size: number }) => {
    const isOverSize = size ? file.size > Math.pow(1024, 2) * size : false;
    if (isOverSize) {
      message.error(`超过大小限制${size}M，请重新选择！`);
    }
    return !isOverSize;
  };
  // 格式限制
  const checkAccpt = (file: { type: string }) => {
    let res: boolean = true;
    console.log(file?.type)
    if (acceptType && file?.type && getAccepts(acceptType).indexOf(file?.type) === -1) {
      message.error('文件格式不正确，请重新选择！');
      res = false;
    }
    return res;
  };
  // 上传前验证
  const beforeCheck = (file: { type: string; size: number }) => {
    const isAccpet = checkAccpt(file);
    const isSize = checkSize(file);
    console.log(isAccpet, isSize);
    return isSize && isAccpet ? true : Upload.LIST_IGNORE;
  };

  /** 添加data和header */
  const resProps = useMemo(() => {
    return {
      ...restProps,
      action,
      data: {},
      headers: {
        token: window.localStorage.getItem('token') || '',
      },
    };
  }, [restProps, action]);

  const valueList = useMemo(() => {
    if (value) {
      if (typeof value === 'string') {
        return [
          {
            url: value,
            uid: Math.random().toString(),
            name: label,
          },
        ];
      }
      return value.map((item) => {
        return {
          url: item,
          uid: Math.random().toString(),
          name: label,
        };
      });
    }
    return [];
  }, [value, label]);
  /**
   * @description: listType
   * @param {*} useMemo
   * @return {*}
   */
  // const listType = useMemo(() => {
  //   return upLoadType === 1 ? 'picture-card' : undefined;
  // }, [upLoadType]);
  /**
   * @description: 传出去的数据
   * @param {*} useMemo
   * @return {*}
   */
  const urlList = useMemo(() => {
    const arr: string[] = [];

    fileList.map((item) => {
      const res = item.response;
      if (res && res.code === 200) {
        arr.push(res.data.fileName);
      } else if (item.url && item.uid) {
        arr.push(item.url);
      }
    });

    return arr;
  }, [fileList]);

  /**
   * @description: 触发change事件
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    if (onchange) {
      onchange(urlList);
    }
    // 这里 hook 不能加 onchange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlList]);
  /**
   * @description: handleChange
   * @param {UploadChangeParam} info
   * @return {*}
   */
  const handleChange = (info: UploadChangeParam) => {
    const list = info.fileList;
    const res = info.file.response;

    setfileList(list);
    if (res) {
      if (res.code !== 200) {
        message.error('上传失败');
      }
    }
  };
  /**
   * @description: 取消展示
   * @param {*}
   * @return {*}
   */
  const handleCancel = () => {
    setpreviewVisible(false);
  };
  /**
   * @description: 删除
   * @param {UploadFile} file
   * @return {*}
   */
  const handleRemove = (file: UploadFile) => {};
  /**
   * @description: 显示展示
   * @param {UploadFile} file
   * @return {*}
   */
  const handlePreview = (file: UploadFile) => {
    let url = '';
    if (file.response && file.response.code === 200) {
      url = file.response.data.fileName;
      get_temp_url({ fileUrl: url }).then((res) => {
        window.open(res.data);
      });
    } else if (file.url) {
      url = file.url;
      window.open(url);
    } else if (file.thumbUrl) {
      url = file.thumbUrl;
      window.open(url);
    }
    if (acceptType === 'image') {
      setpreviewVisible(true);
      setpreviewImage(url);
    }
  };

  // const upDom = () => {
  //   return upLoadType === 1 ? (
  //     <div>
  //       <PlusOutlined />
  //       <div style={{ marginTop: 8 }}>上传</div>
  //     </div>
  //   ) : (
  //     <Button icon={<UploadOutlined />}>上传</Button>
  //   );
  // };
  return (
    <>
      <Upload
        {...resProps}
        fileList={fileList && fileList.length > 0 ? fileList : valueList}
        onChange={(info) => {
          handleChange(info);
        }}
        onPreview={handlePreview}
        onRemove={(file) => {
          handleRemove(file);
        }}
        beforeUpload={beforeCheck}
        maxCount={maxCount}
        listType={acceptType === 'image' ? 'picture-card' : 'text'}
      >
        {fileList && fileList.length >= (maxCount || 1) ? null : (
          <>
            {acceptType === 'image' ? (
              <PlusOutlined />
            ) : (
              <Button icon={<UploadOutlined />}>上传</Button>
            )}
          </>
        )}
      </Upload>
      {extra && <div style={{ color: '#999' }}>{extra}</div>}
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};
export default FormUpLoad;
