import type {Meta, StoryObj} from '@storybook/react-vite';
import {Icon} from 'sandbox-fds-icons';
import {expect, userEvent, within} from 'storybook/test';
import {Button} from '../components/Button';

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  args: {children: 'Create shipment', tone: 'primary', size: 'medium', loading: false, loadingAnnouncement: 'Creating shipment', fullWidth: false, disabled: false},
  argTypes: {
    children: {control: 'text', description: 'Short, verb-first action label.'},
    tone: {control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'danger'], description: 'Visual emphasis and semantic intent.', table: {defaultValue: {summary: 'primary'}}},
    size: {control: 'inline-radio', options: ['small', 'medium', 'large'], description: 'Compact control height: 28px, 32px, or 40px.', table: {defaultValue: {summary: 'medium'}}},
    loading: {control: 'boolean', description: 'Prevents repeat activation, preserves focus and label, and replaces an icon slot with progress.', table: {defaultValue: {summary: 'false'}}},
    loadingAnnouncement: {control: 'text', description: 'Progress message announced to assistive technology.', table: {defaultValue: {summary: 'Loading'}}},
    fullWidth: {control: 'boolean', description: 'Fills a constrained parent, typically in narrow forms or mobile layouts.', table: {defaultValue: {summary: 'false'}}},
    disabled: {control: 'boolean', description: 'Use only when the action is genuinely unavailable.', table: {defaultValue: {summary: 'false'}}},
    startIcon: {control: false},
    endIcon: {control: false},
  },
  parameters: {
    fds: {approved: true, status: 'approved'},
    layout: 'centered',
    controls: {include: ['children', 'tone', 'size', 'loading', 'loadingAnnouncement', 'fullWidth', 'disabled']},
    docs: {
      controls: {include: ['children', 'tone', 'size', 'loading', 'loadingAnnouncement', 'fullWidth', 'disabled']},
      description: {component: 'Buttons trigger actions; use links for navigation. Use short, verb-first, sentence-case labels and one primary action per decision area. Medium is the default; small is reserved for dense operational surfaces.'},
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const icon = (name: string) => <Icon name={name} />;
const shortcut = (keys: string) => <kbd className="fds-keybinding-hint" aria-hidden="true">{keys}</kbd>;
const row = {display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--fds-space-8)'} as const;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}>
    <Button>Primary button</Button>
    <Button tone="secondary">Secondary button</Button>
    <Button tone="tertiary">Tertiary button</Button>
    <Button tone="danger">Danger button</Button>
  </div>,
  play: async ({canvasElement}) => {
    const primary = within(canvasElement).getByRole('button', {name: 'Primary button'});
    const style = getComputedStyle(primary);
    await expect(style.fontWeight).toBe('600');
    await expect(style.gap).toBe('8px');
    await expect(style.paddingBlockStart).toBe('0px');
    await expect(style.borderColor).not.toBe(style.backgroundColor);
    await expect(style.transitionProperty).toBe('color, background-color, border-color, box-shadow');
    await userEvent.hover(primary);
    await expect(getComputedStyle(primary).backgroundColor).toBe('rgb(0, 84, 189)');
  },
};

export const Sizes: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}><Button size="small">Small button</Button><Button>Medium button</Button><Button size="large">Large button</Button></div>,
};

export const IconPlacement: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}>
    <Button tone="secondary">Text only</Button>
    <Button tone="secondary" startIcon={icon('download')}>Download</Button>
    <Button tone="secondary" endIcon={icon('arrow_forward')}>Continue</Button>
  </div>,
};

export const MenuTrigger: Story = {
  parameters: {controls: {disable: true}},
  render: () => <Button tone="secondary" endIcon={icon('expand_more')} aria-haspopup="menu" aria-expanded="false">Export options</Button>,
};

export const KeyboardShortcut: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}><Button tone="secondary" endIcon={shortcut('⌘ Z')}>Undo</Button><Button endIcon={shortcut('⌘ S')}>Save changes</Button></div>,
};

export const FullWidth: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={{width: 320}}><Button fullWidth>Continue</Button></div>,
};

export const LoadingStates: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}>
    <Button loading loadingAnnouncement="Saving changes" onClick={() => {throw new Error('Loading button activated');}}>Save changes</Button>
    <Button loading startIcon={icon('upload')} loadingAnnouncement="Uploading file">Upload file</Button>
    <Button loading endIcon={icon('download')} loadingAnnouncement="Exporting data">Export data</Button>
  </div>,
  play: async ({canvasElement}) => {
    const buttons = [...canvasElement.querySelectorAll<HTMLButtonElement>('.fds-button')];
    if (buttons.some((button) => button.disabled || button.getAttribute('aria-disabled') !== 'true')) throw new Error('Loading contract is not exposed correctly');
    buttons[0]?.focus();
    buttons[0]?.click();
    if (canvasElement.ownerDocument.activeElement !== buttons[0]) throw new Error('Loading button lost focus');
  },
};

export const Disabled: Story = {
  parameters: {controls: {disable: true}},
  render: () => <div style={row}><Button disabled>Unavailable</Button><Button aria-disabled="true" onClick={() => {throw new Error('ARIA-disabled button activated');}}>Temporarily unavailable</Button><Button tone="danger" disabled>Delete shipment</Button></div>,
  play: async ({canvasElement}) => {
    canvasElement.querySelector<HTMLButtonElement>('[aria-disabled="true"]')?.click();
  },
};

export const KeyboardFocus: Story = {
  parameters: {controls: {disable: true}},
  render: () => <Button tone="secondary">Focused button</Button>,
  play: async ({canvasElement}) => {
    canvasElement.querySelector('button')?.focus();
  },
};
