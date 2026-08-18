import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Switch} from '../components/Switch';

const meta = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {label: 'Exception alerts', checked: true, onChange: () => {}, description: 'Notify the shipment owner immediately.'},
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Switch changes a boolean setting immediately. Use Checkbox when the choice is submitted or saved with the rest of a form.'}}},
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const ImmediateSetting: Story = {render: () => {const [checked, setChecked] = useState(true); return <Switch label="Exception alerts" checked={checked} onChange={setChecked} description="Notify the shipment owner immediately." />;}, play: async ({canvasElement}) => {const control = canvasElement.querySelector<HTMLButtonElement>('[role="switch"]'); control?.click(); await new Promise<void>((resolve) => requestAnimationFrame(() => resolve())); if (control?.getAttribute('aria-checked') !== 'false') throw new Error('Switch did not publish its controlled state');}};
export const DisabledWithReason: Story = {args: {label: 'Inherited setting', isDisabled: true, disabledMessage: 'This setting is inherited from the master job.'}};
