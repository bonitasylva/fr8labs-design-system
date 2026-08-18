import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {RadioGroup} from '../components/RadioGroup';

const options = [{label: 'Ocean', value: 'ocean'}, {label: 'Air', value: 'air'}];
const describedOptions = [{...options[0], description: 'Use for FCL and LCL shipments.'}, {...options[1], description: 'Use for airport-to-airport shipments.'}];
const meta = {
  title: 'Components/Inputs/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {label: 'Shipment mode', value: 'ocean', onChange: () => {}, options},
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'RadioGroup owns the shared label, selection, validation, and availability state for a short list where exactly one option can be selected. Use Select for longer lists or constrained space.'}}},
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const ControlledSelection: Story = {render: () => {const [value, setValue] = useState('ocean'); return <RadioGroup label="Shipment mode" value={value} onChange={setValue} options={options} />;}};
export const OptionDescriptions: Story = {args: {options: describedOptions}};
export const RequiredValidation: Story = {args: {value: '', isRequired: true, description: 'Choose the transport used for this shipment.', error: 'Select a shipment mode.'}};
export const DisabledWithReason: Story = {args: {isDisabled: true, disabledMessage: 'Shipment mode is inherited from the master job.'}};
export const OptionIntegrity: Story = {args: {value: 'missing', options: [...options, {label: 'Duplicate ocean', value: 'ocean'}, {label: 'Reserved empty value', value: ''}]}, play: async ({canvasElement}) => {if (canvasElement.querySelectorAll('input').length !== options.length || canvasElement.querySelector('input:checked')) throw new Error('RadioGroup option integrity contract failed');}};
