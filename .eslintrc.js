module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',

    // Conflict with Prettier
    'space-before-function-paren': 'off',

    // Warn
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': 'warn',

    // Enforce Semi Colon
    semi: ['error', 'always']
  }
};
