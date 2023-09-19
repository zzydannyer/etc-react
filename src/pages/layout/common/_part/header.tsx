/*
 * @Author: cmf
 * @Date: 2020-10-19 13:29:03
 * @LastEditTime: 2021-09-27 15:26:42
 * @LastEditors: Please set LastEditors
 * @Description: 顶部右上角
 * @FilePath: /evdata-exam/src/pages/layout/common/_part/header.tsx
 */
import * as React from 'react';
import type { FC } from 'react';
import { request } from 'umi';
import { Avatar, Menu, Dropdown, message, Modal } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { LOGOUT_YWTB } from '@/commonServe/api';
import {
  post_logout,
  StudentTrainInfoServe,
  get_access_token,
  get_logout_ywtb,
} from '@/commonServe';
import type { History } from 'history';
import { Location } from 'history';
import Upmodify from './upmodify';
import type { UserInfo, StudentInfo } from '@/models/commonModel.interface';

interface HeaderRrightProps {
  history: History;
  userInfo: UserInfo;
  studentInfo: StudentInfo;
}

const GET_USER_URL = encodeURIComponent(`${window.location.origin}/front/prevLogin`);

const HeaderRright: FC<HeaderRrightProps> = (props) => {
  const isStudent = window.localStorage.getItem('isStudent');
  /**修改弹框值*/
  const [visible, setVisible] = React.useState(false);
  const { history, userInfo, studentInfo } = props;

  const handleStudetLyout = () => {
    Modal.confirm({
      title: '确定退出吗？',
      onOk: async () => {
        const accessTokenRes = await get_access_token();

        //  request(LOGOUT_YWTB,{
        //    method:'get',
        //    params:{
        //     accessToken:accessTokenRes.data,
        //     type:1,
        //    }
        //  })
        // await get_logout_ywtb({
        //   accessToken:accessTokenRes.data,
        //   type:1,
        // })
        // console.log(accessTokenRes)
        StudentTrainInfoServe.get_logout().then((res) => {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('userName');
          window.localStorage.removeItem('isStudent');
          window.localStorage.removeItem('studentToken');

          window.location.href = `${LOGOUT_YWTB}?accessToken=${accessTokenRes.data}&type=1&callbackUrl=${GET_USER_URL}`;
        });
      },
    });
  };

  /**退出 */
  const handleLyout = () => {
    if (isStudent === 'true') {
      handleStudetLyout();
      return;
    }
    Modal.confirm({
      title: '确定退出吗？',
      onOk: () => {
        post_logout().then((res) => {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('userName');
          window.localStorage.removeItem('isStudent');
          window.localStorage.removeItem('studentToken');
          // history.replace('/front/login');
          window.location.href = `${window.location.origin}/front/login`;
        });
      },
    });
  };
  /** 打开*/
  const handleLyoutmodify = () => {
    setVisible(true);
  };
  /**取消回调*/
  const setismodeDetail = () => {
    setVisible(false);
  };
  const menu = (
    <Menu>
      {isStudent === 'false' && (
        <Menu.Item onClick={handleLyoutmodify} key="2">
          修改密码
        </Menu.Item>
      )}
      <Menu.Item onClick={handleLyout} key="1">
        退出
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="base-right-header">
      <Dropdown overlay={menu}>
        <span>
          <Avatar
            alt=""
            style={{ backgroundColor: '#87d068', marginRight: '12px' }}
            icon={<UserOutlined />}
          />
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            {userInfo.userName ? userInfo.userName : studentInfo.name}
            &nbsp;&nbsp;
            <DownOutlined />
          </a>
        </span>
      </Dropdown>
      <Upmodify
        history={history}
        visible={visible}
        handleLyout={handleLyout}
        setismodeDetail={setismodeDetail}
      ></Upmodify>
    </div>
  );
};
export default HeaderRright;
