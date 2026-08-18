import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {ActionGroup} from '../components/ActionGroup';
import {Button} from '../components/Button';
import {FilterBar} from '../components/FilterBar';
import {Select} from '../components/Select';
import {TextInput} from '../components/TextInput';

const statusOptions = [{label: 'Draft', value: 'draft'}, {label: 'Pending', value: 'pending'}, {label: 'Approved', value: 'approved'}];
const fields = <><TextInput label="Shipment number" value="" onChange={() => {}} placeholder="SHP-…" density="compact" /><Select label="Status" value="" onChange={() => {}} placeholder="All statuses" options={statusOptions} /></>;

const meta = {
  title: 'Components/Layout/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  args: {children: fields, actions: <Button type="submit">Apply filters</Button>, label: 'Shipment filters', onSubmit: (event) => event.preventDefault()},
  argTypes: {children: {control: false}, actions: {control: false}},
  parameters: {
    fds: {approved: true, status: 'approved'},
    docs: {
      description: {
        component: 'FilterBar groups controls that narrow a result set. It is a native labeled form, wraps fields and actions on narrow widths, and leaves filter state and result updates to the owning workflow.',
      },
    },
  },
} satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledFilters() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  return <div style={{display: 'grid', gap: 12}}><FilterBar label="Shipment filters" onSubmit={(event) => {event.preventDefault(); setMessage('Filters applied.');}} actions={<ActionGroup><Button type="button" tone="tertiary" onClick={() => {setQuery(''); setStatus(''); setMessage('Filters cleared.');}}>Clear</Button><Button type="submit">Apply filters</Button></ActionGroup>}><TextInput label="Shipment number" value={query} onChange={setQuery} placeholder="SHP-…" density="compact" /><Select label="Status" value={status} onChange={setStatus} placeholder="All statuses" options={statusOptions} /></FilterBar><span role="status">{message}</span></div>;
}

export const Playground: Story = {};
export const ControlledSubmission: Story = {render: () => <ControlledFilters />};
export const NarrowWrapping: Story = {render: () => <ControlledFilters />, decorators: [(Story) => <div style={{maxWidth: 360}}><Story /></div>]};
