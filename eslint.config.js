import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

// eslint-plugin-react-hooks@7 (~2MB CJS) cold-loads very slowly here; omitted intentionally.
// react-refresh/only-export-components floods route/store files — keep lint focused on real bugs.
export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage', 'build']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^[A-Z_]',
        ignoreRestSiblings: true,
      }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
])
