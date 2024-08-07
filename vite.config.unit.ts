import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['lib/**/*.ts'],
      exclude: ['lib/**/vendor/**'],
    },
    globalSetup: './test/unit/global-setup.ts',
  },
});
