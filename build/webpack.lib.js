const path = require('node:path')

const rootPath = process.cwd()
module.exports = {
  entry: path.resolve(rootPath, 'src/index.ts'),
  output: {
    path: path.resolve(rootPath, 'dist'),
    filename: 'index.js',
    library: {
      type: 'umd',
      name: 'vue-use-web',
    },
    globalObject: 'this',
  },
}
