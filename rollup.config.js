import typescript from 'rollup-plugin-typescript';
// import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      name: 'ylIndicator',
      format: 'umd',
      banner: `/*\n * yl-indicator\n * @version: ${pkg.version}\n * last modified: ${new Date().toLocaleString()}\n */`
    },
    {
      format: "es",
      name: 'ylIndicator',
      banner: `/*\n * yl-indicator\n * @version: ${pkg.version}\n * last modified: ${new Date().toLocaleString()}\n */`,
      file: pkg.module
    }
  ],
  plugins: [
    typescript({lib: ["es5", "es6"], target: "es5"}), // typescript 在 babel之前
    // uglify(),
  ]
};