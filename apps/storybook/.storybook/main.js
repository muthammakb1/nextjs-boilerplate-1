import { resolve } from 'path';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      esbuild: {
        jsx: 'automatic',
      },
      resolve: {
        alias: [
          {
            find: '@indigo-shared-lib/ui',
            replacement: resolve(__dirname, '../../../packages/ui/src'),
          },
          {
            find: '@indigo-shared-lib/hooks',
            replacement: resolve(__dirname, '../../../packages/hooks/src'),
          },
          {
            find: '@indigo-shared-lib/tokens',
            replacement: resolve(__dirname, '../../../packages/tokens/src'),
          },
          {
            find: '@indigo-shared-lib/utils',
            replacement: resolve(__dirname, '../../../packages/utils/src'),
          },
        ],
      },
    });
  },
};

export default config;
