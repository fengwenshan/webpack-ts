module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  globals: {
    // 允许在代码中使用全局变量
    dayjs: 'readonly',
    // 'document': true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    // 'prettier',
  ],
  rules: {
    // 禁用console warn
    'no-console': 'warn',
    // 允许箭头函数在只有一个参数时省略括号
    'arrow-parens': ['error', 'as-needed'],
  },
  ignorePatterns: [
    // 忽略特定文件或目录
    'dist/**', // 忽略构建输出目录
    'node_modules/**', // 忽略node_modules
    'build/**',
    '*.js',
    // '*.d.ts',
  ],
}
