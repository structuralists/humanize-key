import tsParser from '@typescript-eslint/parser';

// Single-file utility library: a lightweight flat config that shares
// scaffolding's foundation (flat config + the TypeScript parser) without the
// React/boundaries plugins that only make sense for the component library.
export default [
   {
      files: ['src/**/*.ts'],
      languageOptions: {
         parser: tsParser,
         parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
         },
      },
      rules: {
         'no-var': 'error',
         'prefer-const': 'error',
         eqeqeq: ['error', 'smart'],
         // TypeScript resolves identifiers/types and reports genuinely unused
         // symbols; ESLint's core runtime-scope rules false-positive on type
         // annotations (e.g. named params in a function-type alias), so defer
         // both to tsc.
         'no-undef': 'off',
      },
   },
];
