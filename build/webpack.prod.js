const path = require('node:path')

const { merge } = require('webpack-merge')

const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const glob = require('glob')
const common = require('./webpack.common.js')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smwp = new SpeedMeasureWebpackPlugin()
const rootPath = process.cwd()

const Dotenv = require('dotenv').config({
  path: ['.env.local.prod', '.env.prod', '.env'],
})

const prodConfig = {
  devtool: 'hidden-source-map',
  optimization: {
    // 禁用js代码压缩(true就是使用mode配置的基本压缩)
    // minimize: false,
    minimizer: [
      // // 使用多个TerserPlugin实例，覆盖默认压缩工具
      // new TerserWebpackPlugin(),

      // 压缩、优化css
      new CssMinimizerWebpackPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        generator: {
          filename: './assets/images/[name].[contenthash:8][ext]',
        },
        parser: {
          // 10kb以下的资源内联
          dataUrlCondition: { maxSize: 10 * 1024 },
        },
      },
    ],
  },
  externals: ['dayjs'],
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${rootPath}/src/**/*`, { nodir: true }),
      // 忽略的类名(安全属性，防止去掉)
      safelist: ['html'],
    }),
    // 将css从js从提取出来
    new MiniCssExtractPlugin({
      filename: './assets/css/[name].[contenthash:8].css',
      chunkFilename: './assets/css/[name].[contenthash:8].css',
    }),
    new ESLintWebpackPlugin({
      extensions: ['ts', 'js', 'tsx', 'jsx'], // 检查的扩展
      exclude: ['node_modules', 'dist'], // 排除文件或目录
      // TODO: 暂时关闭多线程，因为多线程会报错
      // https://github.com/webpack-contrib/eslint-webpack-plugin/issues/137 等待该issues解决
      // https://github.com/webpack-contrib/eslint-webpack-plugin/issues/146
      threads: false, // 开启多线程以加速 ESLint 检查
      emitError: true, // 在编译时将 ESLint 错误作为错误发出
      emitWarning: true, // 将 ESLint 警告作为编译警告发出
      fix: true, // eslint 自动修复
      failOnError: true, // 生产环境下，ESLint 错误会导致构建失败
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${rootPath}/public/`,
          globOptions: {
            ignore: ['**/index.html', '**/.DS_Store'], // 忽略文件
          },
        },
      ],
    }),
  ],
}

module.exports = smwp.wrap(merge(common, prodConfig))
