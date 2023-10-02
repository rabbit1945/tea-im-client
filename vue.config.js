const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  //配置代理跨
  devServer: {
    proxy: {
     
      "/api": {
        target: "http://api.lightning.gzy:8078/",
        pathRewrite: {
          '^/api': '/home'
        }
      },

      "/static": {
        target: "http://api.lightning.gzy:8078/",
      },

      "/audio": {
        target: "http://api.lightning.gzy:8078/storage",
      },
      

    },
    
  },
  
})
