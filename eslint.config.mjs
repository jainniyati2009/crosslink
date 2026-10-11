import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({ baseDirectory: import.meta.dirname, recommendedConfig: js.configs.recommended });
const config = [
  ...compat.config({ extends: ['next/core-web-vitals'] }),
  { ignores: ['.next/**', 'node_modules/**', '.pnpm-store/**', 'next-env.d.ts'] }
];
export default config;
