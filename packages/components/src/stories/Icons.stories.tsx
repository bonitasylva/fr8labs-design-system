import type {Meta, StoryObj} from '@storybook/react-vite';
import {Icon} from 'sandbox-fds-icons';

const iconNames = [
  'add',
  'arrow_forward',
  'calendar_month',
  'chevron_left',
  'chevron_right',
  'close',
  'delete',
  'download',
  'edit',
  'expand_more',
  'help',
  'info',
  'menu',
  'more_vert',
  'refresh',
  'search_off',
  'upload',
] as const;

const meta: Meta<{size: 16 | 20}> = {
  title: 'Foundations/Icons',
  args: {size: 20},
  argTypes: {size: {control: 'inline-radio', options: [16, 20]}},
  parameters: {
    docs: {
      description: {
        component: 'Icons currently used by FDS components and stories. The icon package renders Material Symbols Sharp by name; adding a name here makes current FDS usage visible without expanding the package API.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<{size: 16 | 20}>;

export const CurrentUsage: Story = {
  render: ({size}) => (
    <section aria-labelledby="fds-icons-heading" style={{display: 'grid', gap: 'var(--fds-space-5)'}}>
      <header style={{display: 'grid', gap: 'var(--fds-space-2)'}}>
        <h2 id="fds-icons-heading" style={{margin: 0}}>Icons</h2>
        <p style={{margin: 0}}>Names currently used across FDS components and documented examples.</p>
      </header>
      <ul style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))', gap: 'var(--fds-space-3)', margin: 0, padding: 0, listStyle: 'none'}}>
        {iconNames.map((name) => (
          <li key={name} style={{display: 'flex', alignItems: 'center', gap: 'var(--fds-space-3)', padding: 'var(--fds-space-3)', border: 'var(--fds-border-default) solid var(--fds-color-border-default)', borderRadius: 'var(--fds-radius-control)'}}>
            <Icon name={name} size={size} />
            <code>{name}</code>
          </li>
        ))}
      </ul>
    </section>
  ),
};
