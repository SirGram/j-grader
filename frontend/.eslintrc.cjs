module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
     'airbnb-typescript'
  ],  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "project": "./tsconfig.json" // Path to your tsconfig.json file
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Apply the following rules only to TypeScript files
      rules: {
        // You can add specific TypeScript rules here
      },
    },
  ],
}
