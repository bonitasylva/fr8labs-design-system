import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {TextInput} from '../components/TextInput';

const meta = {title: 'Components/Inputs/TextInput', component: TextInput, tags: ['autodocs'], parameters: {fds: {approved: true, status: 'approved'}}} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

function InputStates() {
  const [reference, setReference] = useState('CI-24018-REV2');
  return <div style={{display: 'grid', gap: '1rem', minWidth: '20rem'}}><TextInput label="Invoice reference" value={reference} onChange={setReference} isRequired description="Use the supplier reference for audit matching." density="compact" /><TextInput label="Ocean freight" value="" onChange={() => {}} error="Enter an amount greater than zero." /><TextInput label="Source invoice reference" value="CARRIER-2026-7842" onChange={() => {}} readOnly description="Read-only source document value." /><TextInput label="Legal entity" value="Example Logistics Indonesia" onChange={() => {}} isDisabled disabledMessage="Legal entity is inherited from the shipment." /></div>;
}

export const States: Story = {args: {label: 'Invoice reference', value: '', onChange: () => {}}, render: () => <InputStates />};
