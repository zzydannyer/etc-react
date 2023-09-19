/*
 * @Author: 陈明烽
 * @FilePath: /evdata-exam/config/router.ts
 * @Description: 路由配置
 */

import type { IRoute } from 'umi';

const routers: IRoute[] = [
  {
    path: '/',
    exact: false,
    component: '@/pages/layout/index',

    routes: [
      {
        path: '/',
        redirect: '/front/prevLogin',
        title: '首页',
      },
      {
        path: '/404',
        component: '@/pages/error/404',
        title: '错误页面',
      },
      {
        path: '/front',

        component: '@/pages/front/index',
        routes: [
          {
            path: '/front/prevLogin',
            exact: true,
            component: '@/pages/front/prevLogin/index',
            title: '一网通办扫码登录',
          },
          {
            path: '/front/login',
            exact: true,
            component: '@/pages/front/login/login',
            title: '登录',
          },
          {
            path: '/front/uploadVideo',
            exact: true,
            component: '@/pages/front/uploadVideo/index',
            title: '登录',
          },
        ],
      },
      {
        path: '/teacher',
        component: '@/pages/teacher/index',
        routes: [
          {
            path: '/teacher/playVideo',
            component: '@/pages/teacher/playVideo/index',
            title: '视频播放',
          },
          {
            path: '/teacher/studentSys',
            component: '@/pages/teacher/studentSys/index',
            routes: [
              {
                path: '/teacher/studentSys/studentList',
                component: '@/pages/teacher/studentSys/studentList/studentList',
                title: '学员列表',
                exact: true,
              },
              {
                path: '/teacher/studentSys/Detail',
                component: '@/pages/teacher/studentSys/Detail/index',
                title: '学员详情',
                exact: true,
              },
            ],
          },
          {
            path: '/teacher/trainSys',
            component: '@/pages/teacher/trainSys/index',
            routes: [
              {
                path: '/teacher/trainSys/trainList',
                component: '@/pages/teacher/trainSys/trainList/trainList',
                title: '培训列表',
                exact: true,
              },
              {
                path: '/teacher/trainSys/trainDetial',
                component: '@/pages/teacher/trainSys/trainDetial/trainDetial',
                title: '培训详情',
                exact: true,
              },

              {
                path: '/teacher/trainSys/addTrain',
                component: '@/pages/teacher/trainSys/addTrain/addTrain',

                routes: [
                  {
                    path: '/teacher/trainSys/addTrain/step1',
                    component: '@/pages/teacher/trainSys/addTrain/step1/index',
                    title: '基础信息',
                    exact: true,
                  },
                  {
                    path: '/teacher/trainSys/addTrain/step2',
                    component: '@/pages/teacher/trainSys/addTrain/step2/index',
                    title: '设计课程',
                    exact: true,
                  },
                  {
                    path: '/teacher/trainSys/addTrain/step3',
                    component: '@/pages/teacher/trainSys/addTrain/step3/index',
                    title: '考试设置',
                    exact: true,
                  },
                  {
                    path: '/teacher/trainSys/addTrain/step4',
                    component: '@/pages/teacher/trainSys/addTrain/step4/index',
                    title: '成功',
                    exact: true,
                  },
                ],
              },
              {
                path: '/teacher/trainSys/topicList',
                component: '@/pages/teacher/trainSys/topicList/topicList',
                title: '题目列表',
                exact: true,
              },
              {
                path: '/teacher/trainSys/upDataVideo',
                component: '@/pages/teacher/trainSys/upDataVideo/index',
                title: '上传视频',
                exact: true,
              },
            ],
          },
        ],
      },

      // {
      //   path: '/home',
      //   exact: true,
      //   component: '@/pages/home/index',
      //   title: '首页',
      // },
      {
        path: '/sys',
        component: '@/pages/sys/index',
        routes: [
          {
            path: '/sys/user',
            exact: true,
            component: '@/pages/sys/user/user',
            title: '用户管理',
          },
          {
            path: '/sys/dept',
            exact: true,
            component: '@/pages/sys/dept/dept',
            title: '部门',
          },
          {
            path: '/sys/menu',
            exact: true,
            component: '@/pages/sys/menu/menu',
            title: '菜单管理',
          },
          {
            path: '/sys/role',
            exact: true,
            component: '@/pages/sys/role/index',
            title: '角色管理',
          },
          {
            path: '/sys/dict',
            exact: true,
            component: '@/pages/sys/dict/dict',
            title: '字典管理',
          },
          {
            path: '/sys/loginlog',
            exact: true,
            component: '@/pages/sys/loginlog/loginlog',
            title: '登录日志',
          },
          {
            path: '/sys/log',
            exact: true,
            component: '@/pages/sys/log/log',
            title: '操作日志',
          },
        ],
      },

      {
        path: '/student',
        component: '@/pages/student/index',
        routes: [
          {
            path: '/student/home',
            component: '@/pages/student/home1',
            title: '首页',
          },
          {
            path: '/student/training',
            component: '@/pages/student/train',
            title: '我的培训',
          },
          {
            path: '/student/training/detail',
            component: '@/pages/student/train/detail',
            title: '培训详情',
          },
          {
            path: '/student/training/exam',
            component: '@/pages/student/train/exam',
            title: '考试',
          },
          {
            path: '/student/training/learning',
            component: '@/pages/student/train/learning',
            title: '继续学习',
          },
        ],
      },
    ],
  },
];

export default routers;
