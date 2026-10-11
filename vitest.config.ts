import { defineConfig } from 'vitest/config';
export default defineConfig({test:{include:['tests/integration/**/*.test.ts']},resolve:{alias:{'@':new URL('./src',import.meta.url).pathname,'server-only':new URL('./tests/fixtures/server-only.ts',import.meta.url).pathname}}});
