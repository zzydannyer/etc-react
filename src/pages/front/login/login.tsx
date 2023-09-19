import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect, Link, useDispatch, useHistory } from 'umi';
import { Form, Table, message, Space, Input, Button, Modal } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import type { CommonModelState } from '@/models/commonModel.interface';

import { Md5 } from 'ts-md5/dist/md5';
import './login.less';
import { useAntdTable, useSize } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { post_login } from '@/commonServe';
// import { Result, Item, SearchForm } from './Login.interface';
import ForgetPassword from './_part/ForgetPassword';
import loginLeft from '@/assets/image/login-left.png';
import logo3 from '@/assets/image/logo3.png';
import { InfoCircleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

interface LoginProps extends IRouteComponentProps {
  commonState: CommonModelState;
}

interface LoginParams {
  account: string;
  captcha: string;
  password: string;
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 20 },
};

const Login: React.FC<LoginProps> = (props) => {
  const { commonState } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [isShowForgetPassword, setisShowForgetPassword] = useState<boolean>(false);
  const [form] = Form.useForm<LoginParams>();

  /**验证码地址 */
  const [captcha, setcaptcha] = useState<string>();
  const [captchaTime, setCaptchaTime] = useState<number>(new Date().getTime());
  const [loginParams, setloginParams] = useState<LoginParams>({
    captcha: '',
    account: '',
    password: '',
  });
  /**拼接验证码地址 */
  useEffect(() => {
    setcaptcha(`/evdata-ets-api/api/captcha?t=${captchaTime}`);
  }, [captchaTime]);
  /**点击登录 */
  const onFinish = (values: LoginParams) => {
    // history.replace('/home');

    post_login({
      ...values,
      password: Md5.hashStr(values.password),
    }).then((res) => {
      if (res.code === 200) {
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('userName', res.data.name);

        history.replace('/teacher/trainSys/trainList');
      } else {
        message.error(res.msg);
      }
    });
    console.log('Success:', values);
  };

  useEffect(() => {
    window.localStorage.removeItem('studentToken');
    window.localStorage.removeItem('token');
    window.localStorage.setItem('isStudent', 'false');
  }, []);
  return (
    <div className="login">
      <div className="login-content fx-row fx-row-middle fx-row-center ">
        <div className="login-left">
          {/* <img className="logo3" src={logo3} alt="" /> */}
          <div className="login-title">
            <div className="login-hz">上海市机电设备国内招标评标专家培训平台</div>
            <div className="login-yw">
            Shanghai expert training terrace for domestic bid evaluation of machinery & electric equipment
            </div>
          </div>
          <img className="login-left-img" src={loginLeft} alt="" />
        </div>
        <div className="login-right">
          <div className="h5">
            <h5>用户登录</h5>
          </div>
          <Form
            className="login-form"
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label="账号"
              name="account"
              rules={[{ required: true, message: '请输入账号!' }]}
              required={false}
            >
              <Input
                size="large"
                placeholder="请输入账号"
                addonAfter={<UserOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
              required={false}
            >
              <Input
                type="password"
                size="large"
                placeholder="请输入密码"
                addonAfter={<LockOutlined className="login-input-icon" />}
              />
            </Form.Item>
            <Form.Item
              label="验证码"
              name="captcha"
              className="form-captcha"
              // {...tailLayout}
              required={false}
              rules={[{ required: true, message: '请输入验证码!' }]}
            >
              <div className="login-captcha">
                <Input className="captcha-input" onKeyUp={(e)=>{
                  if(e.key === 'Enter'){
                    form.submit();
                  }
                }} placeholder="请输入验证码" />
                <img
                  onClick={() => {
                    setCaptchaTime(new Date().getTime());
                  }}
                  className="captcha-img"
                  src={captcha}
                  alt=""
                />
              </div>
            </Form.Item>
          </Form>
          <div className="login-sub">
            <div className="fx-row">
              <Space size="middle">
                <Button
                  size="large"
                  onClick={() => {
                    form.submit();
                  }}
                  type="primary"
                  shape="round"
                  htmlType="submit"
                  className="submiy"
                >
                  登录
                </Button>
              </Space>
              <div className="forget">
                <Button
                  className="wj"
                  onClick={() => {
                    Modal.warning({
                      title: '管理员',
                      content: (
                        <div>
                          <p>如忘记密码，请联系管理员重置密码。</p>
                        </div>
                      ),
                      onOk() {},
                    });
                  }}
                  type="link"
                >
                  忘记密码
                </Button>
              </div>
              {/* <Button
              className="login-register"
              onClick={() => {
                setisShowRegister(true);
              }}
            >
              注册
            </Button> */}
            </div>
          </div>
        </div>
        <ForgetPassword
          setisShowForgetPassword={setisShowForgetPassword}
          isShowForgetPassword={isShowForgetPassword}
        ></ForgetPassword>
      </div>
      <div className="login-footer">
        <div className="login-footer-danwei">主办单位：上海市经济和信息化委员会</div>
        <div className="login-footer-jishu">技术支持：上海市新能源汽车公共数据采集与监测研究中心</div>
      </div>
      {/* <Register
        isShowRegister={isShowRegister}
        setisShowRegister={setisShowRegister}
      ></Register> */}
    </div>
  );
};
interface StateMdoelType {
  commonState: CommonModelState;
}

export default connect(({ commonState }: StateMdoelType) => {
  return {
    commonState,
  };
})(Login);
