const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  //配置代理跨域
  devServer: {
    proxy: {
     
      "/api": {
        target: "http://127.0.0.1:8078/",
        pathRewrite: {
          '^/api': '/home'
        }
      },

      "/static": {
        target: "http://127.0.0.1:8078/",
      },

      "/audio": {
        target: "http://127.0.0.1:8078/storage",
      },

    },
    
  },
  
})
