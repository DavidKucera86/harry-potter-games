import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

const tsLanguageOptions = {
  parser: tsparser,
  ecmaVersion: 'latest',
  sourceType: 'module',
};

const tsRules = {
  ...tseslint.configs.recommended.rules,
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
};

export default [
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', 'shared/**', 'guess-*/**', 'who-is-on-photo/**', 'menu.js'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ...tsLanguageOptions,
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: tsRules,
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      ...tsLanguageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tsRules,
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
