const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin")

const vueConfig = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    disableHostCheck: true,
    host: '127.0.0.1',
    port: 7007,
    open: true,
    proxy: {
      '/api/v1/': {
        target: 'http://172.16.97.194:7007',
        changeOrigin: true,
      },
      '/api/my/': {
        target: 'http://172.16.97.194:3000',
        changeOrigin: true,
      },
      '/api/qualitygates/': {
        target: 'http://172.16.128.75:9000',
        changeOrigin: true,
      },
    },
    watchOptions: {
      ignored: ['**/node_modules', '**/.#*']
    }
  },
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new MonacoEditorWebpackPlugin()
    ]
  }
}

module.exports = vueConfig
