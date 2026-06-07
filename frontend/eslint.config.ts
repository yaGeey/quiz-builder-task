import eslintReact from '@eslint-react/eslint-plugin'
import eslintJs from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig({
   files: ['**/*.ts', '**/*.tsx'],

   extends: [
      eslintJs.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs['recommended-typescript'],
      reactHooks.configs.flat.recommended,
      eslintConfigPrettier,
   ],

   languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
         projectService: true,
         tsconfigRootDir: import.meta.dirname,
      },
   },

   rules: {
      '@eslint-react/no-missing-key': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
   },
})
