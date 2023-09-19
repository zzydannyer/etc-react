// config/webpack.config.ts
const chainWebpack: any = (config: any, { webpack }: any) => {
  // 这里只能这么写，config.merge的方式有问题
  config.optimization.splitChunks({
    chunks: 'all',
    minSize: 3000,
    minChunks: 1,
    automaticNameDelimiter: '~',
    cacheGroups: {
      // 组件库相关
      react: {
        name: 'react',
        chunks: 'all',
        test: /(react|react-dom|react-router|react-router-dom|moment|antd|@ant-design)/,
        priority: 12,
      },
      // 工具库相关
      // utils: {
      //   name: 'utils',
      //   chunks: 'all',
      //   test: /(lodash|ramda)/,
      //   priority: 11,
      // },
      // 图表库相关
      // charts: {
      //   name: 'charts',
      //   chunks: 'all',
      //   test: /(echarts|bizcharts|@antv)/,
      //   priority: 11,
      // },
      vendors: {
        name: 'vendors',
        chunks: 'all',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
      },
    },
  });
};

export default chainWebpack;
