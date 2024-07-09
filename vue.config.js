const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
{
  [
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      // test: /.js$|.html$|.json$|.css/,
      test: /.js$|.json$|.css/,
      threshold: 10240, // 只有大小大于该值的资源会被处理
      minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      // deleteOriginalAssets: true // 删除原文件
    })
  ]
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  //配置代理跨
  devServer: {
    proxy: {
     
      "/api": {
        target: "http://127.0.0.1:8078/",
       
      },

      "/static": {
        target: "http://127.0.0.1:8078/",
      },

      "/files": {
        target: "http://127.0.0.1:8078/storage",
      },

      "/audio": {
        target: "http://127.0.0.1:8078/storage",
      },

    },
    
  },
  
})
