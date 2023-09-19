/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/layout/common/index.tsx
 * @Description: layout
 */

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { useHistory, useDispatch, useLocation, connect } from 'umi';
import { Switch } from 'react-router';
import menuItemRender from './_part/MenuItemRender';
import { Icon } from 'shevdc-component';
// import { useTransition, animated } from 'react-spring';
import type { LayoutProps } from '../index';
import './index.less';
import Logo3 from './_part/logo3';
import Logo from './_part/logo';
import HeaderRright from './_part/header';
import HistoryRouter from './_part/HistoryRouter';
import _menuData from './_part/menuData';
import { Select } from 'antd';
import type { CommonModelState } from '@/models/commonModel.interface';
// import { foward, back, fowardHasTranslateX, backHasTranslateX } from './animation';

const HeaderRrightMemo = memo(HeaderRright);
const { Option } = Select;
interface Route extends MenuDataItem {
  routes?: Route[];
}

type CommonProps = LayoutProps;

const Common: React.FC<CommonProps> = (props) => {
  const { children, commonState } = props;
  const [menuData, setMenuData] = useState<MenuDataItem[]>([]);
  /**navTree 导航数据 */
  const { navTree, historyRoute, userInfo, studentInfo } = commonState;
  const history = useHistory();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  /**是否收起 */
  const [collapsed, setcollapsed] = useState<boolean>(false);

  const isStudent = window.localStorage.getItem('isStudent');

  /**
   * @description: 渲染Icon和文字
   * @param {type}
   * @return {type}
   */
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const loopMenuItem = useCallback((navTree: NavTree[], parentUrl: string = ''): MenuDataItem[] => {
    const s: MenuDataItem[] = [];
    for (let i = 0; i < navTree.length; i += 1) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { children } = navTree[i];
      const { icon } = navTree[i];

      if (children) {
        s.push({
          path: parentUrl + navTree[i].url,
          name: navTree[i].name,
          icon: icon && typeof icon === 'string' ? <Icon type={icon} /> : '',
          children: loopMenuItem(children, parentUrl + navTree[i].url),
          key: parentUrl + navTree[i].url,
        });
      } else {
        s.push({
          path: parentUrl + navTree[i].url,
          name: navTree[i].name,
          icon: icon && typeof icon === 'string' ? <Icon type={icon} /> : '',
          key: parentUrl + navTree[i].url,
        });
      }
    }

    return s;
  }, []);
  /**
   * @description: 生产menu
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    const s = loopMenuItem(navTree);
    setMenuData(s);
  }, [navTree, loopMenuItem]);
  /**
   * @description: 获取各种静态信息
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    if (isStudent === 'false') {
      dispatch({
        type: 'commonState/getStaticChooseMap',
      });
      dispatch({
        type: 'commonState/commonDoNotNeedSecurity',
      });
      dispatch({
        type: 'commonState/getUserInfo',
      });
    }
  }, [dispatch, isStudent]);

  const [pathname, setPathname] = useState('/');

  /**页面过渡动画 */
  // const newSwitch = <Switch location={location}>{children.props.children}</Switch>;

  // const transitions = useTransition(
  //   newSwitch,
  //   location.pathname,
  //   history.action === 'PUSH' ? fowardHasTranslateX : backHasTranslateX,
  // );
  function handleChange(value: number) {
    dispatch({
      type: 'commonState/currentStation',
      payload: {
        stationId: value,
      },
    });
  }
  return (
    <ProLayout
      navTheme="light"
      loading={loading}
      location={location}
      title=""
       logo={<></>}
      fixSiderbar
      onCollapse={(_collapsed: boolean) => {
        /**收起 展开触发 */
        setcollapsed(_collapsed);
      }}
      //headerRender={false}
      menuDataRender={() => (isStudent === 'true' ? _menuData : menuData)}
      rightContentRender={() => (
        <>
          <div className="acr">
            <div className="headerRender">
              <div className="headertile">上海市机电设备国内招标评标专家培训平台</div>
            </div>
            <div>
              <HeaderRrightMemo
                studentInfo={studentInfo}
                userInfo={userInfo}
                history={history}
                key={0}
              />
            </div>
          </div>
        </>
      )}
      menuItemRender={(item, dom) =>
        menuItemRender({
          item,
          dom,
          setPathname,
          history,
          dispatch,
        })
      }
    >
      <>{children}</>
    </ProLayout>
  );
};
interface StateMdoelType {
  commonState: CommonModelState;
}
export default connect(({ commonState }: StateMdoelType) => {
  return {
    commonState,
  };
})(Common);
