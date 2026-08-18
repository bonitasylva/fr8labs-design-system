import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';
import {Button} from '../components/Button';
import {InlineAlert} from '../components/InlineAlert';

const meta = {
  title: 'Components/Feedback/InlineAlert',
  component: InlineAlert,
  tags: ['autodocs'],
  parameters: {
    fds: {approved: true, status: 'approved'},
    docs: {
      description: {
        component: 'InlineAlert provides contextual information beside the visible workflow it affects. The title is optional. It supports a status icon, supporting message, list, non-primary direct action, three sizes, low or high emphasis, and dismissible or persistent behavior. Use a notification for completed background work, a banner for system-wide issues, and field help for one input. Errors announce assertively; info, success, and warning updates announce politely.',
      },
    },
  },
} satisfies Meta<typeof InlineAlert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Informational: Story = {
  args: {tone: 'info', children: 'The carrier changed the document cut-off to 16:00 WIB.'},
  play: async ({canvasElement}) => {
    await expect(getComputedStyle(within(canvasElement).getByRole('status')).alignItems).toBe('center');
  },
};
export const Success: Story = {args: {tone: 'success', children: 'Invoice INV-24018 was approved and posted.'}};
export const Warning: Story = {
  args: {tone: 'warning', children: 'The supplier reference is missing from this charge.'},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  },
};
export const Error: Story = {args: {tone: 'error', persistent: true, children: 'Ocean freight must be greater than zero before approval.'}};
export const TitleAndDescription: Story = {args: {tone: 'warning', title: 'Approval required', description: 'An accounting approver must review this invoice before it can be posted.'}};
export const CompleteMessage: Story = {
  args: {
    tone: 'success',
    title: 'Transaction successful',
    description: 'The invoice was approved and its accounting balance was updated.',
    list: ['Invoice: INV-24018', 'Approved by: Sample Reviewer'],
    action: <Button size="small" tone="tertiary">View invoice</Button>,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(getComputedStyle(canvas.getByRole('status')).alignItems).toBe('flex-start');
    await userEvent.tab();
    await expect(canvas.getByRole('button', {name: 'View invoice'})).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', {name: 'Dismiss'})).toHaveFocus();
  },
};
export const HighEmphasis: Story = {
  args: {
    tone: 'success',
    highEmphasis: true,
    title: 'Report ready for review',
    description: 'Download it from the dashboard or open it directly below.',
    action: <Button size="small" tone="tertiary">View report</Button>,
  },
  parameters: {docs: {description: {story: 'Use high emphasis only when the message needs additional attention or stronger separation from nearby content.'}}},
};
export const Sizes: Story = {
  render: () => <div style={{display: 'grid', gap: 'var(--fds-space-4)'}}>
    {(['small', 'medium', 'large'] as const).map((size) => <InlineAlert key={size} tone="warning" size={size} title={`${size[0].toUpperCase()}${size.slice(1)}`} persistent>Internal padding, text, and icon size scale together.</InlineAlert>)}
  </div>,
};
export const PersistentError: Story = {
  args: {
    tone: 'error',
    persistent: true,
    title: 'Correct all errors to continue',
    list: ['Last name is required.', 'The charge currency is formatted incorrectly.', 'The password must contain a number and a special character.'],
  },
  parameters: {docs: {description: {story: 'Persistent messages do not expose a dismiss action. Remove them automatically when the blocking condition is resolved.'}}},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {name: 'Dismiss'})).not.toBeInTheDocument();
  },
};
export const ErrorWithAction: Story = {
  args: {
    tone: 'error',
    persistent: true,
    description: 'Resolve the tax code mismatch before posting this invoice.',
    action: <Button size="small" tone="tertiary">Review charge</Button>,
  },
  parameters: {docs: {description: {story: 'The title is optional. Alert actions inherit the active status color and never use primary treatment.'}}},
};
export const Dismissible: Story = {
  args: {tone: 'info', title: 'Software update available', description: 'The update includes security and workflow improvements.', dismissIconAriaLabel: 'Dismiss message'},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {name: 'Dismiss message'}));
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
  },
};
export const ConstrainedWidth: Story = {
  args: {tone: 'warning', title: 'Reference needs review', description: 'The supplier reference SUPPLIER-REFERENCE-2026-08-15-000184 cannot be matched.', action: <Button size="small" tone="tertiary">Review</Button>},
  parameters: {docs: {description: {story: 'The message fills its container. Constrain the parent when a shorter line length is needed; do not assign the alert an arbitrary width.'}}},
  decorators: [(Story) => <div style={{width: 320, maxWidth: '100%'}}><Story /></div>],
};
