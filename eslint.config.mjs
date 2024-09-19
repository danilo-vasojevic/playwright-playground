import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  ignores: [
    '.vscode',
    'node_modules',
    'package',
    'reports',
  ],
}, {
  name: 'additional-rules',
  rules: {
    'node/prefer-global/process': ['error', 'always'],
    'no-console': 'warn',
  },
})
