const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  //配置代理跨
  devServer: {
    proxy: {
     
      "/api": {
        target: "http://192.168.1.108:8078/",
        pathRewrite: {
          '^/api': '/home'
        }
      },

      "/static": {
        target: "http://192.168.1.108:8078/",
      },

      "/audio": {
        target: "http://192.168.1.108:8078/storage",
      },
      

    },
    
  },
  
})
