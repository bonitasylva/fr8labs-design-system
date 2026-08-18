import type {Meta, StoryObj} from '@storybook/react-vite';
import {Icon} from 'sandbox-fds-icons';
import {userEvent} from 'storybook/test';
import {IconButton} from '../components/IconButton';
import {Tooltip} from '../components/Tooltip';

const icon = (name: string) => <Icon name={name} />;

const meta = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {fds: {approved: true, status: 'approved'}, layout: 'centered', docs: {description: {component: 'Tooltip provides brief, non-interactive supporting text for a focusable trigger. It opens on hover or focus and closes on pointer exit, blur, or Escape.'}}},
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SupportingText: Story = {
  args: {content: 'Copied references expire after 24 hours.', children: <IconButton aria-label="Reference expiry details">{icon('info')}</IconButton>},
  play: async ({canvasElement}) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>('button');
    const tooltip = canvasElement.querySelector<HTMLElement>('[role="tooltip"]');
    if (!trigger || !tooltip || trigger.getAttribute('aria-describedby') !== tooltip.id) throw new Error('Tooltip is not connected to its trigger');
    await userEvent.tab();
    if (!tooltip.matches(':popover-open')) throw new Error('Tooltip did not open on keyboard focus');
    await userEvent.keyboard('{Escape}');
    if (tooltip.matches(':popover-open') || canvasElement.ownerDocument.activeElement !== trigger) throw new Error('Escape did not dismiss the tooltip while preserving trigger focus');
  },
};

export const FieldExplanation: Story = {args: {content: 'The carrier booking number, not the house bill number.', children: <IconButton aria-label="Booking number help">{icon('help')}</IconButton>}};
