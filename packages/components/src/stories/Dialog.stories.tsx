import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {userEvent} from 'storybook/test';
import {Button} from '../components/Button';
import {Dialog} from '../components/Dialog';

const meta = {
  title: 'Components/Overlays/Dialog',
  component: Dialog,
  args: {title: 'Document exception', isOpen: false, onOpenChange: () => {}, children: null, dismissOnBackdrop: true, role: 'dialog'},
  argTypes: {
    title: {description: 'Visible title and accessible name.'},
    description: {description: 'Optional supporting context referenced by aria-describedby.'},
    isOpen: {description: 'Controlled open state.'},
    onOpenChange: {description: 'Called for close button, Escape, backdrop, or native close.'},
    dismissOnBackdrop: {description: 'Set false when an outside click could discard unsaved work.', table: {defaultValue: {summary: 'true'}}},
    role: {control: 'inline-radio', options: ['dialog', 'alertdialog'], description: 'Use alertdialog only for urgent confirmations.', table: {defaultValue: {summary: 'dialog'}}},
    children: {control: false},
    actions: {control: false},
  },
  parameters: {fds: {approved: true, status: 'approved'}},
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example({description, destructive = false}: {description?: string; destructive?: boolean}) {
  const [open, setOpen] = useState(false);
  return <><Button onClick={() => setOpen(true)}>Review document exception</Button><Dialog title="Document exception" description={description} isOpen={open} onOpenChange={setOpen} role={destructive ? 'alertdialog' : 'dialog'} actions={<><Button tone="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button tone={destructive ? 'danger' : 'primary'} onClick={() => setOpen(false)}>{destructive ? 'Delete document' : 'Mark resolved'}</Button></>}><p>Commercial invoice is missing consignee tax ID.</p></Dialog></>;
}

export const Default: Story = {render: () => <Example />};
export const TitleAndDescription: Story = {render: () => <Example description="Review this exception before the shipment can proceed." />};
export const ConfirmationActions: Story = {render: () => <Example />};
export const DestructiveConfirmation: Story = {
  render: () => <Example destructive />,
  play: async ({canvasElement}) => {
    canvasElement.querySelector<HTMLButtonElement>('.fds-button')?.click();
    await new Promise(requestAnimationFrame);
    const dialog = canvasElement.querySelector<HTMLDialogElement>('dialog');
    const cancel = Array.from(dialog?.querySelectorAll<HTMLButtonElement>('.fds-dialog__actions button') ?? []).find((button) => button.textContent === 'Cancel');
    if (dialog?.getAttribute('role') !== 'alertdialog' || canvasElement.ownerDocument.activeElement !== cancel) throw new Error('Destructive alert dialog did not focus the safest action');
  },
};
export const KeyboardCloseAndFocusRestore: Story = {
  render: () => <Example description="Press Escape, then confirm focus returns to the trigger." />,
  play: async ({canvasElement}) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>('.fds-button');
    if (!trigger) throw new Error('Dialog trigger is missing');
    await userEvent.click(trigger);
    await new Promise(requestAnimationFrame);
    const dialog = canvasElement.querySelector<HTMLDialogElement>('dialog');
    const close = dialog?.querySelector<HTMLButtonElement>('[aria-label="Close"]');
    if (!dialog?.open || !close || canvasElement.ownerDocument.activeElement !== close) throw new Error('Dialog did not open with focus inside');
    await userEvent.keyboard('{Escape}');
    await new Promise(requestAnimationFrame);
    if (dialog.open || canvasElement.ownerDocument.activeElement !== trigger) throw new Error('Escape did not close the dialog and restore focus');
  },
};
