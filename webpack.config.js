const webpack = require('webpack');

module.exports = {
  // 其他配置...
  plugins: [
    new webpack.ProgressPlugin({
      // 有效选项示例
      activeModules: true,
      entries: true,
      modules: true,
      percentBy: 'entries',
      profile: false,
      handler: (percentage, message, ...args) => {
        console.log(`Build progress: ${percentage * 100}% - ${message}`);
      }
    })
  ]
};