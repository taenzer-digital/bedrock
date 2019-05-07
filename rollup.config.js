import { eslint } from "rollup-plugin-eslint";
import { default as prettier } from 'rollup-plugin-prettier';

const prettierConfig = {
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "always"
};

module.exports = [
  {
    input: 'src/js/bedrock.js',
    output: {
      file: 'js/bundle.js',
      format: 'cjs'
    },
    plugins: [
      eslint({
        fix: true,
      }),
      prettier(prettierConfig),  
    ]
  },
  {
    input: 'src/js/index.js',
    output: {
      file: 'js/index.js',
      format: 'cjs'
    },
    plugins: [
      eslint({
        fix: true,
      }),
      prettier(prettierConfig),  
    ]
  }
]
