import eslintJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintReact from '@eslint-react/eslint-plugin'
import prettier from 'eslint-config-prettier/flat'

export default tseslint.config(
   {
      files: ['**/*.{ts,tsx,js}'],
      ignores: ['node_modules', 'dist', '**/*.d.ts', '**/vite.config.ts'],
   },
   eslintJs.configs.recommended,
   tseslint.configs.recommended,
   prettier,

   {
      files: ['frontend/**/*.{ts,tsx}'],
      extends: [eslintReact.configs['recommended-typescript'], reactHooks.configs.flat.recommended],
      rules: {
         '@eslint-react/no-missing-key': 'warn',
         '@typescript-eslint/no-unused-vars': 'warn',
         '@typescript-eslint/no-explicit-any': 'warn',
      },
      languageOptions: {
         parserOptions: {
            tsconfigRootDir: import.meta.dirname,
         },
      },
   },

   {
      files: ['backend/**/*.ts'],
      rules: {
         '@typescript-eslint/no-unused-vars': 'warn',
         '@typescript-eslint/no-explicit-any': 'warn',
      },
      languageOptions: {
         parserOptions: {
            tsconfigRootDir: import.meta.dirname,
         },
      },
   },
)
