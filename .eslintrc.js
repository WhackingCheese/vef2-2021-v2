module.exports = {

  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Leyfum console.info, warn og error
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-useless-escape': 0,
  },
};
