const path = require('node:path')
const HtmlWbpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const rootPath = process.cwd()
module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: path.resolve(rootPath, 'src/index.ts'),
    hello: path.resolve(rootPath, 'src/hello.ts'),
  },
  output: {
    // 入口文件输出的文件名
    filename: './assets/js/[name].[contenthash:8].js',
    // 非入口文件输出的文件名
    chunkFilename: './assets/js/[name].[contenthash:8].js',
    // 打包的文件夹
    path: path.resolve(rootPath, 'dist'),
    // 在生成文件之前清空 output 目录
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
          // loader 从后向前加载
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
          // {
          //   loader: 'px2rem-loader',
          //   options: {
          //     remUnit: 75, // 1rem = 75px
          //     remPrecision: 8, // 精度：保留几位小数
          //     // 忽略的样式文件
          //     ignore: /node_modules/,
          //   },
          // },
        ],
      },
      {
        test: /\.(m?jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 每次编译时检查是否有之前编译过的文件及其依赖的哈希值相同的缓存结果，如果有，则直接从缓存读取，大大提高了开发时的构建速度
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: './assets/fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWbpackPlugin({
      // 网站标题
      title: '网站标题',
      // 网站图标路径
      favicon: path.resolve(rootPath, 'public/favicon.png'),
      // 自定义模板
      template: path.resolve(rootPath, 'public/index.html'),
      // 注入到body里面， 默认是head
      inject: 'body',
      // // 如果打包是production模式，则默认为true, 也可以自定义options
      favicon: path.resolve(rootPath, 'public/favicon.png'),
      minify: {
        // 压缩HTML中的空白字符
        collapseWhitespace: true,
        // 移除HTML中的注释
        removeComments: true,
        // 删除冗余的HTML属性
        removeRedundantAttributes: true,
        // 将DOCTYPE声明替换为最简形式
        useShortDoctype: true,
        // 移除那些值为空或者等于其默认值的HTML属性
        removeEmptyAttributes: true,
        // 移除style和link标签中的type="text/css"这样的默认属性，因为它们是HTML5中默认的且不必要的。
        removeStyleLinkTypeAttributes: true,
        // 保持自闭合标签的斜杠，这对于XML兼容性是有帮助的，尽管在HTML5中这通常不是必需的。
        keepClosingSlash: true,
        // 压缩内联的JavaScript代码
        minifyJS: true,
        // 压缩内联的CSS代码
        minifyCSS: true,
        // 对HTML中的URL进行压缩，比如去掉尾随的斜杠、缩短路径等，但请注意这可能会有副作用，比如破坏相对路径。
        minifyURLs: true,
      },
    }),
    // 自动加载模块，而不必到处导入或需要它们。
    new webpack.ProvidePlugin({
      // 引入react
      dayjs: 'dayjs',
    }),
  ],
}
