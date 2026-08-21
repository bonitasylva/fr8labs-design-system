import type {Preview} from '@storybook/react-vite';
import {FdsProvider} from '../src/provider';
import {fdsTheme} from './fdsTheme';
import '../src/styles.css';
import './docs.css';

const preview: Preview = {
  decorators: [(Story, context) => context.parameters.fdsProvider === false ? <Story /> : <FdsProvider><h1 style={{clipPath: 'inset(50%)', height: 1, overflow: 'hidden', position: 'absolute', width: 1}}>FDS component preview</h1><Story /></FdsProvider>],
  parameters: {
    a11y: {test: 'error'},
    controls: {expanded: true, sort: 'requiredFirst'},
    docs: {theme: fdsTheme},
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Getting Started', ['Welcome', 'Installation', 'Changelog', 'MCP pilot', 'Component Overview', 'Contributing'],
          'Foundations', ['Design principles', 'Tokens', 'Icons'],
          'Components', ['Runtime', 'Actions', 'Inputs', 'Feedback', 'Data display', 'Navigation', 'Layout', 'Overlays'],
          'Patterns', ['Composition', 'Finance', 'Operations'],
          'Internal', ['Quality', 'Catalog'],
        ],
      },
    },
  },
};

export default preview;
