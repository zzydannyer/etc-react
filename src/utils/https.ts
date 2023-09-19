import { extend, ResponseError, RequestOptionsInit } from 'umi-request';
import { notification, message } from 'antd';

import { Md5 } from 'ts-md5/dist/md5';

const md5 = new Md5();
const codeMessage = {
  '200': '服务器成功返回请求的数据。',
  '201': '新建或修改数据成功。',
  '202': '一个请求已经进入后台排队（异步任务）。',
  '204': '删除数据成功。',
  '400': '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  '401': '用户没有权限（令牌、用户名、密码错误）。',
  '403': '用户得到授权，但是访问是被禁止的。',
  '404': '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  '406': '请求的格式不可得。',
  '410': '请求的资源被永久删除，且不会再得到的。',
  '422': '当创建一个对象时，发生一个验证错误。',
  '500': '服务器发生错误，请检查服务器。',
  '502': '网关错误。',
  '503': '服务不可用，服务器暂时过载或维护。',
  '504': '网关超时。',
};

/**header 验签 */
export const checkHeader = () => {
  const timestamp = new Date().getTime().toString();
  const clientKey = '58935bd753e74f35b62a0a4da2c10913';
  const SECRET = '04d9134e53a24661ae2c9768a47ffe11';
  const sign = Md5.hashStr(clientKey + SECRET + timestamp);
  return {
    timestamp,
    clientKey,
    sign,
  };
};

message.config({
  top: 100,
});
/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  message.destroy();
  if (response && response.status) {
    if (response.status === 403) {
      window.location.replace('/front/login');
    }
    if (response.status === 500) {
      notification.error({
        key: '500',
        description: '服务器发生错误，请稍后再试',
        message: '服务器内部错误',
      });
    }
  } else if (!response) {
    notification.error({
      key: '400',
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 学生端 异常处理程序
 */
const studentErrorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  message.destroy();
  if (response && response.status) {
    if (response.status === 403) {
      window.location.replace('/front/prevLogin');
    }
    if (response.status === 500) {
      notification.error({
        key: '500',
        description: '服务器发生错误，请稍后再试',
        message: '服务器内部错误',
      });
    }
  } else if (!response) {
    notification.error({
      key: '400',
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

const headers: HeadersInit = {
  'Content-Type': 'application/json',
  token: window.localStorage.getItem('token') || '',
};

console.log(process.env.LOGIN_URL);

// if (process.env.NODE_ENV === 'development') {
//   headers.token =
// }

const getRequestOptions = () => {
  return {
    prefix: '/evdata-ets-api/api',
    timeout: 10000,
    errorHandler,
  };
};

const getStudentRequestOptions = () => {
  return {
    prefix: '/evdata-ets-api/api',
    timeout: 10000,
    errorHandler: studentErrorHandler,
  };
};


const request = extend(getRequestOptions());

const videoRequest = extend({
  prefix: '/mock/api',
  timeout: 10000,
});

const requestLoading = extend(getRequestOptions());

const arrayBufferrequest = extend(getRequestOptions());

/**
 * @description: 下载二进制文件
 * @param {*} async
 * @param {*} next
 * @return {*}
 */
arrayBufferrequest.use(async (ctx, next) => {
  const { req } = ctx;
  req.options.headers = {
    'Content-Type': 'application/json',
    token: window.localStorage.getItem('token') || '',
    ...checkHeader(),
  };
  req.options.responseType = 'arrayBuffer'
  await next();
  const {res} = ctx;
  if (res instanceof ArrayBuffer) {
    const url = window.URL.createObjectURL(
      new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    );
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', 'excel.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }else{
    message.error('暂无下载文件')
  }
});

/**
 * @description: 管理员
 * @param {*} async
 * @param {*} next
 * @return {*}
 */
request.use(async (ctx, next) => {
  const { req } = ctx;
  req.options.headers = {
    'Content-Type': 'application/json',
    token: window.localStorage.getItem('token') || '',
    ...checkHeader(),
  };
  await next();
  if (ctx.res.code === 5002) {
    window.location.replace('/front/login');
    // 登录过期
    // window.location.replace(window.location.origin+process.env.LOGIN_URL as string);
  }
});
/**
 * @description: 管理员 有loading的请求
 * @param {*} async
 * @param {*} next
 * @return {*}
 */
requestLoading.use(async (ctx, next) => {
  const key = 'loading';
  const { req } = ctx;
  req.options.headers = {
    'Content-Type': 'application/json',
    token: window.localStorage.getItem('token') || '',
    ...checkHeader(),
  };
  message.loading({ content: '加载中...', key });
  await next();
  message.destroy();
  if (ctx.res.code === 5002) {
    window.location.replace('/front/login');
    // 登录过期
    //  window.location.replace(window.location.origin+process.env.LOGIN_URL as string);
  }
});

/**学生端 */
const studentRequestLoading = extend(getStudentRequestOptions());
const studentRequest = extend(getStudentRequestOptions());

/**
 * @description: 学生端
 * @param {*} async
 * @param {*} next
 * @return {*}
 */
studentRequest.use(async (ctx, next) => {
  const { req } = ctx;
  req.options.headers = {
    'Content-Type': 'application/json',
    studentToken: window.localStorage.getItem('studentToken') || '',
    // studentToken:'013bead5290c44ec900292e4da700424',
    // studentToken:'f59ce9ff05ec4a0b939e37843e68ebf4',
    ...checkHeader(),
  };
  await next();
  if (ctx.res.code === 4004) {
    window.location.replace('/front/prevLogin');
    // 登录过期
    // window.location.replace(window.location.origin+process.env.STUDENT_LOGIN_URL as string);
  }
});

/**
 * @description: 学生端 有loading的请求
 * @param {*} async
 * @param {*} next
 * @return {*}
 */
studentRequestLoading.use(async (ctx, next) => {
  const key = 'loading';
  const { req } = ctx;
  req.options.headers = {
    'Content-Type': 'application/json',
    studentToken: window.localStorage.getItem('studentToken') || '',
    // studentToken:'f59ce9ff05ec4a0b939e37843e68ebf4',
    ...checkHeader(),
  };
  message.loading({ content: '加载中...', key });
  await next();
  message.destroy();
  if (ctx.res.code === 4004) {
    // 登录过期
    window.location.replace('/front/prevLogin');
    // window.location.replace(window.location.origin+process.env.STUDENT_LOGIN_URL as string);
  }
});

export const loadingHttps = requestLoading;

export const https = request;

export const arrayBufferHttps = arrayBufferrequest;

export const studentLoadingHttps = studentRequestLoading;

export const studentHttps = studentRequest;

export const videoHttps = videoRequest;
