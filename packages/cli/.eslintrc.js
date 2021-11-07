module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 1,
    'no-console': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'no-param-reassign': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-plusplus': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['import'],
};
