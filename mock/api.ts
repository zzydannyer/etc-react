import Mock, { Random } from 'mockjs';
//import china from './china.json'
const china = require('./china.json');
export default {
  // 支持值为 Object 和 Array
  'GET /api/city': Mock.mock(() => {
    return Mock.mock({
      'list|10': [{ name: Mock.mock('@city()'), 'value|200-2000': 50, 'type|0-2': 1 }],
    });
  }),
  'GET /api/city2': Mock.mock({
    'list|10': [{ name: Mock.mock('@city()'), 'value|200-2000': 50, 'type|0-2': 1 }],
  }),
  '/api/cheart/china': china,
  // GET 可忽略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req: any, res: any) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('ok');
  },
};
