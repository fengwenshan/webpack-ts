module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // 按需加载
        corejs: 3, // 引入core-js 3版本
      },
    ],
    '@babel/preset-typescript',
  ],
}
