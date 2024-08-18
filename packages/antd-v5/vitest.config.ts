import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import defaultConfig from './vite.config'

const config = mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./scripts/test/window.ts'],
    },
  }),
)

export default config
