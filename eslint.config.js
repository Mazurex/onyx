import eslintPluginNode from '@typescript-eslint/eslint-plugin'
import typescriptEslintParser from '@typescript-eslint/parser'
import eslintPluginImport from 'eslint-plugin-import'

export default {
    root: true,
    parser: typescriptEslintParser,
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    env: {
        node: true,
        es2022: true,
        jest: true,
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    rules: {
        // --- TypeScript ---
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/consistent-type-imports': [
            'error',
            { prefer: 'type-imports' },
        ],

        // --- Brace style (Allman) ---
        'brace-style': ['error', 'allman', { allowSingleLine: false }],
        '@typescript-eslint/brace-style': ['error', 'allman'],

        // --- Imports ---
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'import/no-unresolved': 'error',
        'import/no-default-export': 'error',

        // --- General ---
        'no-console': 'warn',
        'no-duplicate-imports': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        eqeqeq: ['error', 'always'],
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
}
