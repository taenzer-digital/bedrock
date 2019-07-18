import { eslint } from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import prettier from 'rollup-plugin-prettier';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';

const prettierConfig = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
};

const pluginOptions = [
  uglify(),
  prettier(prettierConfig),
  commonjs(),
  eslint({
    fix: true,
  }),
  progress(),
  babel({
    exclude: 'node_modules/**',
  }),
  filesize({
    showGzippedSize: false,
  }),
];

module.exports = [
  {
    input: 'src/js/bedrock.js',
    output: {
      name: 'docs',
      file: 'js/bundle.js',
      format: 'cjs',
    },
    plugins: pluginOptions,
  },
  {
    input: 'src/js/index.js',
    output: {
      name: 'main',
      file: 'js/index.js',
      format: 'cjs',
    },
    plugins: pluginOptions,
  },
];
