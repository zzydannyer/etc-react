module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],

  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    'array-callback-return': 'off',
    'consistent-return': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'spaced-comment': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-console': 'off',
    'react/no-array-index-key': 'off',
  },
};
