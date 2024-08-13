module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  // dist 디렉토리와 .eslintrc.cjs 파일을 ESLint 검사에서 제외
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import', 'prefer-arrow'],
  rules: {
      // React 컴포넌트만 export하도록 경고
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // 타입 임포트를 일관되게 사용하도록 강제
      '@typescript-eslint/consistent-type-imports': 'error',
      // 함수 반환 타입을 명시하도록 강제
      '@typescript-eslint/explicit-function-return-type': 'error',
      // 네이밍의 일관성을 위한 규칙을 설정
      '@typescript-eslint/naming-convention': [
          'error',
          {
              selector: [
                  'variableLike',
                  'classProperty',
                  'objectLiteralProperty',
                  'typeProperty',
                  'classMethod',
                  'objectLiteralMethod',
                  'typeMethod',
                  'accessor',
              ],
              format: ['camelCase'],
              leadingUnderscore: 'allow',
          },
          {
              selector: ['variable'],
              types: ['function'],
              format: ['camelCase', 'PascalCase'],
              leadingUnderscore: 'allow',
          },
          { selector: ['variable'], modifiers: ['global'], format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
          {
              selector: [
                  'classProperty',
                  'objectLiteralProperty',
                  'typeProperty',
                  'classMethod',
                  'objectLiteralMethod',
                  'typeMethod',
                  'accessor',
                  'enumMember',
              ],
              format: null,
              modifiers: ['requiresQuotes'],
          },
      ]
  },
};