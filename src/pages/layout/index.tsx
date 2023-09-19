/*
 * @Author: cmf
 * @Date: 2020-09-23 12:08:59
 * @LastEditTime: 2023-08-30 16:52:00
 * @LastEditors: Please set LastEditors
 * @Description: layout 组件
 * @FilePath: \evdata-exam\src\pages\layout\index.tsx
 */
import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, useMemo, memo, useRef } from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import type { IRouteComponentProps } from 'umi';
import { useHistory, connect, useLocation, useDispatch, getDvaApp } from 'umi';
import type { CommonModelState } from '@/models/commonModel.interface';
import Base from './base/index';
import Common from './common';
// import 'shevdc-component/dist/esm/style/index.css';
import '../../assets/style/index.less';

const CommonMemo = memo(Common);
const BaseMemo = memo(Base);
export interface LayoutProps extends IRouteComponentProps {
  commonState: CommonModelState;
}
const notPermissions = ['404', 'login', '403', ''];

const Layout: FC<LayoutProps> = (props) => {
  const { commonState } = props;
  const { navTree } = commonState;
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const isStudent = window.localStorage.getItem('isStudent');

  // const isStudent = window.localStorage.getItem('isStudent')
  // const menuDat: Route = useMemo(() => {
  //   let d: Route[] = new GetMenuData(navTree).resData;
  //   return {
  //     path: '/',
  //     routes: d,
  //   };
  // }, [navTree]);
  // 必须先请求路由
  useEffect(() => {
    // 获取用户路由
    if (pathname.indexOf('/front') === -1 && navTree.length === 0 && isStudent !== 'true') {
      dispatch({
        type: 'commonState/findNavTree',
      });
      dispatch({
        type: 'commonState/findPermissions',
      });
    }
  }, [pathname, navTree, dispatch, isStudent]);

  /**
   * @description: 隐藏骨架屏
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    let isPhone = false
    const sUserAgent = window.navigator.userAgent;
    if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1) {
      alert('请前往电脑端访问')
      isPhone = true
    }
    const gujia = document.getElementById('gujia');
    if (gujia&&!isPhone) {
      gujia.style.display = 'none';
    }
  }, []);
  // 后面 优化
  return (
    <ConfigProvider locale={zhCN}>
      {pathname.indexOf('/front') > -1 ? (
        <BaseMemo {...props}></BaseMemo>
      ) : (
        <CommonMemo {...props}></CommonMemo>
      )}
    </ConfigProvider>
  );
};

export default connect(({ commonState }: { commonState: CommonModelState }) => ({
  commonState,
}))(Layout);
