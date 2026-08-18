import type {Meta, StoryObj} from '@storybook/react-vite';
import {userEvent} from 'storybook/test';
import {Button} from '../components/Button';
import {Popover} from '../components/Popover';

const meta = {
  title: 'Components/Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {fds: {approved: true, status: 'approved'}, layout: 'centered', docs: {description: {component: 'Popover opens a non-modal interactive panel anchored to a button. It has a visible title, light-dismiss, Escape dismissal, and focus restoration. Use a menu pattern for a list of actions.'}}},
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

const content = <div style={{display: 'grid', gap: '0.75rem'}}><div><strong style={{display: 'block'}}>SHP-260081</strong><span>Jakarta → Rotterdam · Ocean LCL</span></div><Button size="small">View shipment</Button></div>;

export const ShipmentSummary: Story = {
  args: {title: 'Shipment summary', trigger: <Button tone="secondary">Quick view</Button>, children: content},
  play: async ({canvasElement}) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>('[popovertarget]');
    const panel = canvasElement.querySelector<HTMLElement>('[popover]');
    if (!trigger || !panel) throw new Error('Popover trigger or panel is missing');
    await userEvent.click(trigger);
    await new Promise(requestAnimationFrame);
    if (!panel.matches(':popover-open') || canvasElement.ownerDocument.activeElement !== panel || trigger.getAttribute('aria-expanded') !== 'true') throw new Error('Popover did not open with focus and expanded state');
    await userEvent.keyboard('{Escape}');
    await new Promise(requestAnimationFrame);
    if (panel.matches(':popover-open') || canvasElement.ownerDocument.activeElement !== trigger) throw new Error('Escape did not close the popover and restore focus');
  },
};

export const SupportingDetails: Story = {args: {title: 'Charge details', trigger: <Button tone="tertiary">View charge basis</Button>, children: <p style={{margin: 0}}>Ocean freight is calculated per container and excludes destination handling.</p>}};
