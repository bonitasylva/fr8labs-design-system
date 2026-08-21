import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Select} from '../components/Select';

const options = [{label: 'Bluewater Shipping', value: 'bluewater'}, {label: 'Northstar Ocean', value: 'northstar'}, {label: 'Harborline Cargo', value: 'harborline'}];
const meta = {
  title: 'Components/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  args: {label: 'Carrier', value: '', onChange: () => {}, options, placeholder: 'Select a carrier'},
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Select one value from a predefined list. This component stays native so keyboard and popup behavior follow the user’s browser and operating system; searchable selection requires a separately owned combobox.'}}},
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ControlledSelection: Story = {
  render: () => { const [value, setValue] = useState('northstar'); return <Select label="Carrier" value={value} onChange={setValue} options={options} />; },
};

export const AvailabilityStates: Story = {
  render: () => <div style={{display: 'grid', gap: 'var(--fds-space-16)', minWidth: 320}}><Select label="Loading carrier" value="" onChange={() => {}} options={[]} isLoading /><Select label="Destination location" value="" onChange={() => {}} options={options} /><Select label="Legal entity" value="bluewater" onChange={() => {}} options={options} isDisabled disabledMessage="Legal entity is inherited from the shipment." /></div>,
};

export const Validation: Story = {args: {label: 'Destination location', description: 'Choose the freight destination.', error: 'Select a destination location.', placeholder: 'No location selected'}};

export const NativeKeyboardBehavior: Story = {
  render: () => { const [value, setValue] = useState(''); return <Select label="Carrier" value={value} onChange={setValue} options={options} description="Tab to the control, then use the browser’s native selection keys." />; },
};

export const OptionIntegrity: Story = {
  args: {value: 'missing', options: [...options, {label: 'Duplicate Northstar', value: 'northstar'}, {label: 'Reserved empty value', value: ''}]},
  play: async ({canvasElement}) => {
    const select = canvasElement.querySelector('select');
    if (!select || select.value !== '' || select.options.length !== options.length + 1) throw new Error('Select option integrity contract failed');
  },
};
