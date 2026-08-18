import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {userEvent} from 'storybook/test';
import {Button} from '../components/Button';
import {Drawer} from '../components/Drawer';
import {TextInput} from '../components/TextInput';

const meta = {
  title: 'Components/Overlays/Drawer',
  component: Drawer,
  args: {title: 'Charge details', isOpen: false, onOpenChange: () => {}, children: null, dismissOnBackdrop: true, role: 'dialog'},
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
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example({content = 'default'}: {content?: 'default' | 'form' | 'long'}) {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState('CARRIER-2026-7842');
  return <><Button onClick={() => setOpen(true)}>Edit charge</Button><Drawer title="Ocean freight · OFR-LCL" description="Charge details" isOpen={open} onOpenChange={setOpen} dismissOnBackdrop={content !== 'form'} actions={<><Button tone="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Save charge</Button></>}>{content === 'form' ? <><TextInput label="Charge code" value="OFR-LCL" onChange={() => {}} isRequired density="compact" /><TextInput label="Source invoice reference" value={reference} onChange={setReference} density="compact" /></> : content === 'long' ? Array.from({length: 24}, (_, index) => <p key={index}>Charge note {index + 1}: carrier documentation is ready for review.</p>) : <p>Review charge details and save the update when ready.</p>}</Drawer></>;
}

export const DefaultRightSideDrawer: Story = {render: () => <Example />};
export const FormContent: Story = {
  render: () => <Example content="form" />,
  play: async ({canvasElement}) => {
    canvasElement.querySelector<HTMLButtonElement>('.fds-button')?.click();
    await new Promise(requestAnimationFrame);
    const drawer = canvasElement.querySelector<HTMLDialogElement>('dialog');
    drawer?.click();
    await new Promise(requestAnimationFrame);
    if (!drawer?.open) throw new Error('Backdrop dismissed a drawer with unsaved form work');
  },
};
export const LongScrollableContent: Story = {
  render: () => <Example content="long" />,
  play: async ({canvasElement}) => {
    canvasElement.querySelector<HTMLButtonElement>('.fds-button')?.click();
    await new Promise(requestAnimationFrame);
    const drawer = canvasElement.querySelector<HTMLDialogElement>('dialog');
    const content = drawer?.querySelector<HTMLElement>('.fds-drawer__content');
    if (!drawer || !content || content.tabIndex !== 0 || drawer.scrollHeight > drawer.clientHeight || content.scrollHeight <= content.clientHeight) throw new Error('Only the keyboard-focusable long drawer body should scroll');
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== content) throw new Error('Tab did not move focus into the long drawer body');
  },
};
export const KeyboardCloseAndFocusRestore: Story = {
  render: () => <Example />,
  play: async ({canvasElement}) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>('.fds-button');
    if (!trigger) throw new Error('Drawer trigger is missing');
    await userEvent.click(trigger);
    await new Promise(requestAnimationFrame);
    const drawer = canvasElement.querySelector<HTMLDialogElement>('dialog');
    const close = drawer?.querySelector<HTMLButtonElement>('[aria-label="Close"]');
    if (!drawer?.open || !close || canvasElement.ownerDocument.activeElement !== close) throw new Error('Drawer did not open with focus inside');
    await userEvent.keyboard('{Escape}');
    await new Promise(requestAnimationFrame);
    if (drawer.open || canvasElement.ownerDocument.activeElement !== trigger) throw new Error('Escape did not close the drawer and restore focus');
  },
};
