import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {InlineInput} from '../components/InlineInput';

const meta = {
  title: 'Components/Data display/InlineInput',
  component: InlineInput,
  tags: ['autodocs'],
  decorators: [(Story) => <table aria-label="Editable invoice charge"><thead><tr><th scope="col" style={{padding: 'var(--fds-space-8)', textAlign: 'start'}}>Charge</th><th scope="col" style={{padding: 'var(--fds-space-8)', textAlign: 'end'}}>Amount</th></tr></thead><tbody><tr><th scope="row" style={{padding: 'var(--fds-space-8)', textAlign: 'start'}}>Ocean freight</th><td style={{minWidth: 180, padding: 'var(--fds-space-8)'}}><Story /></td></tr></tbody></table>],
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'InlineInput edits one dense value inside a table cell. Its label is an accessible name rather than visible field chrome; use TextInput for ordinary forms. It does not add editing behavior to DataTable or FDSDataGrid.'}}},
} satisfies Meta<typeof InlineInput>;
export default meta;
type Story = StoryObj<typeof meta>;

function EditableInput({initialValue = ''}: {initialValue?: string}) {
  const [value, setValue] = useState(initialValue);
  return <InlineInput label="Ocean freight amount" value={value} onChange={setValue} inputMode="decimal" placeholder="0.00" />;
}

const requiredArgs = {label: 'Ocean freight amount', value: '', onChange: () => {}};

export const EditableAmount: Story = {args: requiredArgs, render: () => <EditableInput />};
export const CompactCell: Story = {args: {label: 'Ocean freight amount', value: '1,250.00', onChange: () => {}, density: 'compact', inputMode: 'decimal'}};
export const ValueEntered: Story = {args: requiredArgs, render: () => <EditableInput initialValue="12,480.00" />};
export const DisabledCell: Story = {args: {label: 'Posted amount', value: '12,480.00', onChange: () => {}, disabled: true}};
export const CellValidation: Story = {args: {label: 'Ocean freight amount', value: '0', onChange: () => {}, error: 'Enter an amount greater than zero.', helpText: 'Enter the supplier invoice amount.', inputMode: 'decimal'}};
export const KeyboardEditingAndFocus: Story = {args: requiredArgs, render: () => <EditableInput initialValue="1,250.00" />};
