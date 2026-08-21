import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {ActionGroup, Avatar, Button, EmptyState, FilterBar, PageHeader, Pagination, RadioGroup, Select, Switch, Textarea} from '../index';

const meta = {title: 'Patterns/Composition/Core compositions', tags: ['autodocs']} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function FormControls() {
  const [notes, setNotes] = useState('');
  const [mode, setMode] = useState('ocean');
  const [alerts, setAlerts] = useState(true);
  return <div style={{display: 'grid', gap: 'var(--fds-space-16)', maxWidth: 480}}><Textarea label="Review notes" value={notes} onChange={setNotes} description="Visible to the approval team." error={notes.length > 0 && notes.length < 4 ? 'Enter at least four characters.' : undefined} /><RadioGroup label="Shipment mode" value={mode} onChange={setMode} options={[{label: 'Ocean', value: 'ocean'}, {label: 'Air', value: 'air'}]} /><Switch label="Exception alerts" description="Notify the shipment owner." checked={alerts} onChange={setAlerts} /><Switch label="Inherited setting" checked isDisabled disabledMessage="This setting is inherited from the master job." onChange={() => {}} /></div>;
}

function Compositions() {
  const [page, setPage] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  return <div style={{display: 'grid', gap: 'var(--fds-space-24)'}}><PageHeader eyebrow="Shipment job" title="SHP-260081" description="Jakarta to Rotterdam" actions={<ActionGroup><Button size="small" tone="secondary">Export</Button><Button size="small">Update shipment</Button></ActionGroup>} /><FilterBar onSubmit={(event) => {event.preventDefault(); setSubmitted(true);}} actions={<Button size="small" type="submit">Apply filters</Button>}><label>Search<input className="fds-control" name="query" aria-label="Search shipments" /></label><label>Status<select className="fds-control" name="status" defaultValue=""><option value="">All statuses</option><option>Pending</option></select></label></FilterBar>{submitted ? <span role="status">Filters applied.</span> : null}<div style={{display: 'flex', alignItems: 'center', gap: 'var(--fds-space-8)'}}><Avatar name="Sample Operator" /><Avatar name="Broken Image" src="/missing-avatar.png" /><span>Owner avatars, including image fallback</span></div><EmptyState title="No shipments found" description="Change the filters or create a shipment job." action={<Button>Create shipment</Button>} /><Pagination page={page} pageCount={4} onPageChange={setPage} /><Pagination page={-4} pageCount={0} onPageChange={() => {}} label="Empty result pagination boundary" /></div>;
}

function FailureStates() {
  const [mode, setMode] = useState('');
  return <div style={{display: 'grid', gap: 'var(--fds-space-16)', maxWidth: 420}}><Select label="Loading carrier" value="" onChange={() => {}} options={[]} isLoading /><Select label="No carrier matches" value="" onChange={() => {}} options={[]} /><RadioGroup label="Shipment mode" value={mode} onChange={setMode} options={[{label: 'Ocean', value: 'ocean'}, {label: 'Air', value: 'air'}]} error="Select a shipment mode." /><Textarea label="Disabled notes" value="Inherited from shipment" onChange={() => {}} isDisabled /></div>;
}

export const FormStates: Story = {render: () => <FormControls />};
export const CompositionStates: Story = {render: () => <Compositions />};
export const LoadingEmptyFailureAndBoundaries: Story = {render: () => <FailureStates />};
