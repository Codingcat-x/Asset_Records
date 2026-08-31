const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      // 将以 /api 开头的请求转发到后端 3000 端口
      // 例如 /api/add -> http://localhost:3000/api/add
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
