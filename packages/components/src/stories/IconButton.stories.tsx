import type {Meta, StoryObj} from '@storybook/react-vite';
import {Icon} from 'sandbox-fds-icons';
import {IconButton} from '../components/IconButton';

const meta = {
  title: 'Components/Actions/IconButton',
  component: IconButton,
  args: {'aria-label': 'Refresh shipment', children: <Icon name="refresh" />, tone: 'tertiary', size: 'medium', loading: false, loadingAnnouncement: 'Refreshing shipment', disabled: false},
  argTypes: {
    children: {control: false, description: 'A single recognizable, decorative icon.'},
    'aria-label': {control: 'text', description: 'Required action name when aria-labelledby is not supplied.'},
    tone: {control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'danger'], description: 'The same hierarchy and intent used by Button.', table: {defaultValue: {summary: 'tertiary'}}},
    size: {control: 'inline-radio', options: ['small', 'medium', 'large'], description: 'Square target size: 28px, 32px, or 40px.', table: {defaultValue: {summary: 'medium'}}},
    loading: {control: 'boolean', description: 'Prevents repeat activation while preserving focus and the accessible name.', table: {defaultValue: {summary: 'false'}}},
    loadingAnnouncement: {control: 'text', description: 'Progress message announced to assistive technology.', table: {defaultValue: {summary: 'Loading'}}},
    disabled: {control: 'boolean', description: 'Use only when the action is genuinely unavailable.', table: {defaultValue: {summary: 'false'}}},
    sx: {control: false},
  },
  parameters: {
    fds: {approved: true, status: 'approved'},
    layout: 'centered',
    controls: {include: ['aria-label', 'tone', 'size', 'loading', 'loadingAnnouncement', 'disabled']},
    docs: {
      controls: {include: ['aria-label', 'tone', 'size', 'loading', 'loadingAnnouncement', 'disabled']},
      description: {component: 'IconButton is a compact action for a familiar icon whose meaning remains clear without visible text. Use the same tone and size hierarchy as Button, and always provide an accessible name.'},
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = {display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--fds-space-2)'} as const;

export const Playground: Story = {};

export const Tones: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}>
    <IconButton aria-label="Add shipment" tone="primary"><Icon name="add" /></IconButton>
    <IconButton aria-label="Download document" tone="secondary"><Icon name="download" /></IconButton>
    <IconButton aria-label="Edit shipment"><Icon name="edit" /></IconButton>
    <IconButton aria-label="Delete shipment" tone="danger"><Icon name="delete" /></IconButton>
  </div>,
};

export const Sizes: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}>
    <IconButton aria-label="Previous page" size="small"><Icon name="chevron_left" /></IconButton>
    <IconButton aria-label="Refresh shipment"><Icon name="refresh" /></IconButton>
    <IconButton aria-label="Open navigation" size="large"><Icon name="menu" /></IconButton>
  </div>,
};

export const Loading: Story = {
  parameters: {controls: {disable: true}},
  render: () => <IconButton aria-label="Refresh shipment" loading loadingAnnouncement="Refreshing shipment" onClick={() => {throw new Error('Loading icon button activated');}}><Icon name="refresh" /></IconButton>,
  play: async ({canvasElement}) => {
    const button = canvasElement.querySelector<HTMLButtonElement>('button');
    if (!button || button.getAttribute('aria-busy') !== 'true' || button.getAttribute('aria-disabled') !== 'true') throw new Error('Loading contract is not exposed correctly');
    button.focus();
    button.click();
    if (canvasElement.ownerDocument.activeElement !== button) throw new Error('Loading icon button lost focus');
  },
};

export const Disabled: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}>
    <IconButton aria-label="Delete shipment" disabled><Icon name="delete" /></IconButton>
    <IconButton aria-label="Refresh unavailable" aria-disabled="true" onClick={() => {throw new Error('ARIA-disabled icon button activated');}}><Icon name="refresh" /></IconButton>
  </div>,
  play: async ({canvasElement}) => {
    canvasElement.querySelector<HTMLButtonElement>('[aria-disabled="true"]')?.click();
  },
};

export const KeyboardFocus: Story = {
  parameters: {controls: {disable: true}},
  render: () => <IconButton aria-label="More shipment actions" tone="secondary"><Icon name="more_vert" /></IconButton>,
  play: async ({canvasElement}) => {
    canvasElement.querySelector('button')?.focus();
  },
};

export const NativePassthrough: Story = {
  parameters: {controls: {disable: true}},
  render: () => <IconButton aria-label="Refresh shipment" data-testid="refresh-shipment" sx={{marginInlineStart: 8}}><Icon name="refresh" /></IconButton>,
};
