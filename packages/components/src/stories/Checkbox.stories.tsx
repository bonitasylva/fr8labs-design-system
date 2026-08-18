import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Checkbox} from '../components/Checkbox';

const meta = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {label: 'Include insurance', checked: false, onChange: () => {}},
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Checkbox represents a selection that is submitted or saved with a form. Use Switch instead when changing a setting takes effect immediately; validation belongs to the surrounding checkbox group.'}}},
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Selected: Story = {args: {checked: true}};
export const MixedSelection: Story = {args: {label: 'Select all charge lines', checked: 'indeterminate'}, play: async ({canvasElement}) => {if (!canvasElement.querySelector<HTMLInputElement>('input')?.indeterminate) throw new Error('Checkbox indeterminate state was not applied');}};
export const DisabledWithReason: Story = {args: {label: 'Lock shipment currency', checked: true, isDisabled: true, disabledMessage: 'Currency is inherited from the shipment.'}};
export const LabelAndDescription: Story = {render: () => { const [checked, setChecked] = useState(false); return <Checkbox label="Add customs clearance" checked={checked} onChange={setChecked} description="Includes broker charges in the freight estimate." />; }};
