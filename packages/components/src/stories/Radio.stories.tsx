import type {Meta, StoryObj} from '@storybook/react-vite';
import {Radio} from '../components/Radio';

const meta = {
  title: 'Components/Inputs/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: {label: 'Ocean', value: 'ocean', checked: false, onChange: () => {}, name: 'shipment-mode'},
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Radio is one option item for custom native composition. It must share a name with related radio items; use RadioGroup for the standard labeled and validated set.'}}},
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Selected: Story = {args: {checked: true}};
export const LabelAndDescription: Story = {args: {description: 'Use for FCL and LCL shipments.'}};
export const Disabled: Story = {args: {checked: true, isDisabled: true}};
