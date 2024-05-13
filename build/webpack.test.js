const path = require('node:path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const glob = require('glob')
const common = require('./webpack.common.js')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const { on } = require('node:events')
const smwp = new SpeedMeasureWebpackPlugin()

const rootPath = process.cwd()

require('dotenv').config({
  path: ['.env.local.test', '.env.test', '.env'],
})
const prodConfig = {
  devtool: false,
  optimization: {
    // minimize: true,
    minimizer: [
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
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${rootPath}/src/**/*`, { nodir: true }),
      // 忽略的类名(安全属性，防止去掉)
      safelist: ['html'],
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
    // 需要配合FileManagerPlugin使用
    new webpack.SourceMapDevToolPlugin({
      // 会在打包后的文件尾部添加这样的一行文本
      append: `\n//# sourceMappingURL=http://127.0.0.1:8080/[url]`,
      filename: '[file].map',
    }),
    // 拷贝目录下的map文件到dists目录下， 然后删除改文件
    new FileManagerPlugin({
      events: {
        onStart: {
          // 打包之前删除一些目录
          delete: [path.resolve(rootPath, './dists')],
        },
        onEnd: {
          copy: [
            {
              source: path.resolve(rootPath, './dist/**/*.map'),
              destination: path.resolve(rootPath, './dists/'),
            },
          ],
          // TODO: 这个删除有问题 *, 代表一层目录，而不是**
          delete: [path.resolve(rootPath, './dist/*/*/*.js.map')],
        },
      },
    }),
  ],
}

module.exports = smwp.wrap(merge(common, prodConfig))
