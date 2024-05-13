const path = require('node:path')
const fs = require('node:fs')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common.js')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smwp = new SpeedMeasureWebpackPlugin()
const Dotenv = require('dotenv-webpack')

const rootPath = process.cwd()

const envConfigFileColl = ['.env.local.dev', '.env.dev', '.env']
require('dotenv').config({
  path: envConfigFileColl,
})

const envConfigFile = envConfigFileColl.find(item =>
  fs.existsSync(path.resolve(rootPath, item)),
)

console.log(envConfigFile, 'envConfigFile')

console.log(path.resolve(rootPath, 'public'), 'index.html')

const devConfig = {
  entry: path.resolve(rootPath, 'src/index.ts'),
  devtool: 'eval-source-map',
  devServer: {
    static: {
      // 指定静态资源目录
      directory: path.resolve(rootPath, 'public'),
      // 指定静态资源路径, output的publicPath一致
      // publicPath: './',
    },
    open: true,
    compress: true, // 启用 gzip
    host: '0.0.0.0', // 服务器监听地址
    port: 9000, // 端口号
    hot: 'only', // 启用 HMR (only 控制模块热替换)
    server: 'http', // 使用 http、https、spdy
    // webSocketServer: 'ws', // 使用 ws、wss
    client: {
      overlay: false, // 禁用编译错误时显示全屏覆盖层
    },
    // proxy: [
    //   {
    //     context: ['/base-api'],
    //     // 目标服务器
    //     target: 'http://localhost:8080',
    //     // 重写路径
    //     pathRewrite: { '^/base-api': '' },
    //     // 是否改变请求的源
    //     //   true让目标服务器认为请求是从正确的源发起的
    //     //   false 代理请求将会保留原始的主机头信息发送给目标服务器
    //     changeOrigin: true,
    //     secure: false, // 关闭SSL验证
    //   },
    // ],
  },
  module: {
    rules: [
      {
        // 所有图片不进行内联， 生成环境图片进行内联
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        generator: {
          filename: './assets/images/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: envConfigFile,
    }),
  ],
}

module.exports = smwp.wrap(merge(common, devConfig))
