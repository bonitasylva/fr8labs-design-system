import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-links',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  staticDirs: [{from: '../src/fonts', to: '/fonts'}],
  docs: {autodocs: 'tag'},
};

export default config;
