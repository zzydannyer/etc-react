/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/src/pages/front/prevLogin/index.tsx
 * @Description: 预登录
 */

import * as React from 'react';
import type { FC } from 'react';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { Button, message, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { LOGOUT_YWTB } from '@/commonServe/api';
import { get_access_token, get_student_token } from '@/commonServe';
import useUrlState from '@ahooksjs/use-url-state';
import './index.less';

interface PrevLoginProps {}

const PrevLogin: FC<PrevLoginProps> = (props) => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [urlState, seturlState] = useUrlState();
  const { location } = history;

  /**点击登录 */
  const handlePrevLogin = () => {
    const GET_USER_URL = encodeURIComponent(window.location.href);
    seturlState({ userToken: undefined });
    setisLoading(true);
    console.log(GET_USER_URL);
    
    get_access_token().then((res) => {
      setisLoading(false);
      if (res.code === 200) {
        window.location.href = `https://center1.sheitc.sh.gov.cn/center/user/getUser?accessToken=${res.data}&callbackUrl=${GET_USER_URL}&type=1`;
      } else {
        message.error(res.msg);
      }
    });
  };

  const logouAccessToen = async () => {
    const GET_USER_URL = encodeURIComponent(window.location.href);
    const res = await get_access_token();
    if (res.code === 200) {
      window.location.href = `${LOGOUT_YWTB}?accessToken=${res.data}&type=1&callbackUrl=${GET_USER_URL}`;
    }
  };

  /**通过一网通办获取userToken 后进行登录 */
  useEffect(() => {
    const userToken = urlState?.userToken;

    if (userToken) {
      get_student_token({
        userToken,
      }).then((res) => {
        if (res.code === 200) {
          window.localStorage.setItem('studentToken', res.data);
          window.localStorage.setItem('isStudent', 'true');
          window.localStorage.removeItem('token');
          history.replace({ pathname: '/student/home' });
        } else {
          seturlState({
            userToken: undefined,
          });

          message.error(res.msg, 3, () => {
            logouAccessToen();
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState?.userToken]);
  useEffect(() => {
    window.localStorage.removeItem('token');
    window.localStorage.setItem('isStudent', 'true');
  }, []);
  return (
    <div className="prevLogin fx-row fx-row-center fx-row-middle">
      <div className="content fx-column fx-row-center fx-row-space-between">
        <div className="top">
          <h1 className="title">上海市机电设备国内招标评标专家培训平台</h1>
          <p className="subtitle">
          Shanghai expert training terrace for domestic bid evaluation of machinery & electric equipment
          </p>
        </div>
        <div className="btn-div">
          <Button
            className="btn"
            loading={isLoading}
            type="primary"
            onClick={() => {
              handlePrevLogin();
            }}
          >
            随申办市民云扫码登录
          </Button>
          <Tooltip color='#108ee9' placement='bottom' className="download-app" title="请到手机应用市场下载【随申办市民云】App，下载App后可扫码登录。">
            <div>如何安装随申办市民云[APP] <QuestionCircleOutlined /></div>
          </Tooltip>
        </div>
        <div className="bottom">
          <p className="unit">主办单位：上海市经济和信息化委员会</p>
          <div className="support">技术支持：上海市新能源汽车公共数据采集与监测研究中心</div>
        </div>
      </div>
    </div>
  );
};
export default PrevLogin;
