import {addons} from 'storybook/manager-api';
import {fdsTheme} from './fdsTheme';

addons.setConfig({
  theme: fdsTheme,
  layout: {navSize: 280, rightPanelWidth: 360, initialActive: 'sidebar'},
  sidebar: {showRoots: true, collapsedRoots: ['patterns', 'internal']},
});
