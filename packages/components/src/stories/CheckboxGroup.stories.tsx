import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {CheckboxGroup} from '../components/CheckboxGroup';

const options = [{label: 'Freight', value: 'freight'}, {label: 'Customs clearance', value: 'customs'}];
const meta = {
  title: 'Components/Inputs/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  args: {label: 'Included services', values: ['freight'], onChange: () => {}, options},
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'CheckboxGroup owns the shared label, validation, and availability state for multiple related selections. Use Checkbox alone for one independent boolean choice. isRequired shows the required indicator; because native HTML cannot enforce “at least one checkbox in this set,” the owning form validates the values and passes error.'}}},
} satisfies Meta<typeof CheckboxGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const ControlledSelection: Story = {render: () => {const [values, setValues] = useState(['freight']); return <CheckboxGroup label="Included services" values={values} onChange={setValues} options={options} />;}};
export const OptionDescriptions: Story = {args: {options: [{...options[0], description: 'Main transport charges.'}, {...options[1], description: 'Broker handling and clearance charges.'}]}};
export const CallerOwnedRequiredValidation: Story = {args: {values: [], isRequired: true, description: 'Choose at least one service.', error: 'Select one or more services.'}};
export const DisabledWithReason: Story = {args: {isDisabled: true, disabledMessage: 'Services are inherited from the quotation.'}};
export const OptionIntegrity: Story = {args: {values: ['missing'], options: [...options, {label: 'Duplicate freight', value: 'freight'}, {label: 'Reserved empty value', value: ''}]}, play: async ({canvasElement}) => {if (canvasElement.querySelectorAll('input').length !== options.length || canvasElement.querySelector('input:checked')) throw new Error('CheckboxGroup option integrity contract failed');}};
