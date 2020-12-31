module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    es6: true,
  },
  extends: ['eslint-config-airbnb-base'],
  rules: {
    'object-curly-newline': 0,
    'no-undef': 0,
  },
};
