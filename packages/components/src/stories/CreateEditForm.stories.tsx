import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {ActionGroup, Button, CheckboxGroup, InlineAlert, PageHeader, Panel, RadioGroup, Select, Switch, Textarea, TextInput} from '../index';
import './WorkflowPatterns.stories.css';

function CreateEditForm({showErrors = false}: {showErrors?: boolean}) {
  const [reference, setReference] = useState(showErrors ? '' : 'NSE-260815-01');
  const [mode, setMode] = useState(showErrors ? '' : 'ocean');
  const [office, setOffice] = useState('jkt');
  const [services, setServices] = useState<string[]>(['freight']);
  const [notes, setNotes] = useState('Handle original documents at destination.');
  const [notify, setNotify] = useState(true);
  const invalid = showErrors && (!reference || !mode || services.length === 0);

  return <main className="fds-workflow-pattern">
    <PageHeader eyebrow="Shipment job" title="Create shipment" description="Capture the minimum operational details before adding cargo, documents, and charges." />
    {invalid ? <InlineAlert tone="error" title="Shipment cannot be created" description="Complete the required fields marked below." /> : null}
    <form className="fds-workflow-pattern__stack" onSubmit={(event) => event.preventDefault()}>
      <Panel title="Job details" description="Required identifiers and ownership.">
        <div className="fds-workflow-pattern__fields">
          <TextInput label="Customer reference" value={reference} onChange={setReference} isRequired error={showErrors && !reference ? 'Enter a customer reference.' : undefined} />
          <Select label="Owning office" value={office} onChange={setOffice} isRequired options={[{label: 'Jakarta', value: 'jkt'}, {label: 'Singapore', value: 'sin'}, {label: 'Surabaya', value: 'sub'}]} />
        </div>
        <div className="fds-workflow-pattern__section">
          <RadioGroup label="Shipment mode" value={mode} onChange={setMode} isRequired error={showErrors && !mode ? 'Select a shipment mode.' : undefined} options={[{label: 'Ocean', value: 'ocean'}, {label: 'Air', value: 'air'}, {label: 'Road', value: 'road'}]} />
        </div>
      </Panel>
      <Panel title="Services and instructions" description="Optional services can be completed after the job is created.">
        <div className="fds-workflow-pattern__stack">
          <CheckboxGroup label="Services" values={services} onChange={setServices} isRequired error={showErrors && services.length === 0 ? 'Select at least one service.' : undefined} options={[{label: 'Freight', value: 'freight'}, {label: 'Customs clearance', value: 'customs'}, {label: 'Delivery', value: 'delivery'}]} />
          <Textarea label="Handling instructions" value={notes} onChange={setNotes} description="Visible to the operations team." />
          <Switch label="Notify shipment owner" description="Send an internal notification after creation." checked={notify} onChange={setNotify} />
        </div>
      </Panel>
      <ActionGroup><Button type="button" tone="tertiary">Cancel</Button><Button type="button" tone="secondary">Save draft</Button><Button type="submit">Create shipment</Button></ActionGroup>
    </form>
  </main>;
}

const meta = {
  title: 'Patterns/Operations/Create and edit',
  tags: ['autodocs'],
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Approved create/edit template composed from public FDS form controls. It groups required job data before optional services and keeps one primary submission action.'}}},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadyToCreate: Story = {render: () => <CreateEditForm />};
export const ValidationFailure: Story = {render: () => <CreateEditForm showErrors />};
