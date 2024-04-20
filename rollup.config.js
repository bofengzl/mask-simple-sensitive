const typescript = require('@rollup/plugin-typescript');
// @ts-ignore
const babel = require('rollup-plugin-babel');

module.exports = [
  {
    input: 'src/index.ts', //  Rollup 打包的入口文件
    output: { // 打包后的输出文件如何配置。
      format: 'umd', // 指定输出格式为 UMD（Universal Module Definition），这意味着它可以在多种环境中运行，如浏览器和 Node.js。
      file: 'dist/main.js', // 指定输出文件的路径和名称。
      name: 'mask-simple-sensitive', // 库的全局变量名称，当使用 UMD 或 AMD 格式时，这个名称将用于暴露库。
      sourcemap: true, // 生成 source map，这样在调试打包后的代码时，可以映射回原始源代码。
      amd: {
        id: 'mask-simple-sensitive', // AMD（Asynchronous Module Definition）配置，指定模块的 ID。
      },
    },
    plugins: [
      // @ts-ignore
      typescript(), // 它告诉 Rollup 使用 TypeScript 来处理 .ts 和 .tsx 文件。
      babel({ // 这是 rollup-plugin-babel 插件的实例，它用于转译 JavaScript 代码，比如将 ES6+ 语法转译为 ES5。
        exclude: 'node_modules/**', // 表示不处理 node_modules 目录下的代码
        extensions: ['.js', '.ts'], // 表示该插件应处理 .js 和 .ts 文件。
      }),
    ],
  }
]
