module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-console': 'off',
    '@typescript-eslint/no-regex-spaces': 'off',
    '@typescript-eslint/no-debugger': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-mixed-spaces-and-tabs': 'warn',
    'no-undef': 'warn',
    'no-template-curly-in-string': 'warn',
    'consistent-return': 'warn',
    'array-callback-return': 'warn',
    eqeqeq: 'error',
    'no-alert': 'error',
    'no-caller': 'error',
    'no-eval': 'error',
    'no-extend-native': 'warn',
    'no-extra-bind': 'warn',
    'no-extra-label': 'warn',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'warn',
    '@typescript-eslint/no-loop-func': 'warn',
    'no-new-func': 'error',
    'no-new-wrappers': 'warn',
    '@typescript-eslint/no-throw-literal': 'warn',
    'prefer-promise-reject-errors': 'error',
    'for-direction': 'error',
    'getter-return': 'error',
    'no-await-in-loop': 'error',
    'no-compare-neg-zero': 'error',
    'no-catch-shadow': 'warn',
    'no-shadow-restricted-names': 'error',
    'callback-return': 'error',
    'handle-callback-err': 'error',
    'no-path-concat': 'warn',
    'prefer-arrow-callback': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};