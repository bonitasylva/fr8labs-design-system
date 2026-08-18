import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {ActionGroup, Button, DataTable, Drawer, InlineAlert, Metric, PageHeader, Panel, StatusBadge, Textarea} from '../index';
import type {DataTableColumn} from '../index';
import './WorkflowPatterns.stories.css';

type DocumentRow = {document: string; owner: string; status: 'approved' | 'pending' | 'blocked'};

const documentColumns: readonly DataTableColumn<DocumentRow>[] = [
  {id: 'document', header: 'Document', cell: (row) => row.document, width: 'wide'},
  {id: 'owner', header: 'Owner', cell: (row) => row.owner},
  {id: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} />},
];

const documents: DocumentRow[] = [
  {document: 'Commercial invoice', owner: 'Documentation', status: 'approved'},
  {document: 'Packing list', owner: 'Documentation', status: 'approved'},
  {document: 'Consignee tax identification', owner: 'Shipment owner', status: 'blocked'},
];

function RecordDetailReview({approved = false}: {approved?: boolean}) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [notes, setNotes] = useState('');

  return <main className="fds-workflow-pattern">
    <PageHeader eyebrow="Shipment job" title="SHP-260081" description="Jakarta → Rotterdam · Ocean LCL" actions={<ActionGroup><Button tone="secondary">Export</Button><Button onClick={() => setReviewOpen(true)}>{approved ? 'View review' : 'Review shipment'}</Button></ActionGroup>} />
    {approved ? <InlineAlert tone="success" title="Shipment approved" description="Operational review completed by Sample Reviewer on 15 Aug 2026." /> : <InlineAlert tone="warning" title="Review required" description="Consignee tax identification is missing before documentation can be completed." action={<Button size="small" onClick={() => setReviewOpen(true)}>Resolve</Button>} />}
    <section className="fds-workflow-pattern__metrics" aria-label="Shipment summary">
      <Metric label="Status" value={<StatusBadge status={approved ? 'approved' : 'pending'} />} density="compact" />
      <Metric label="ETD" value="18 Aug 2026" density="compact" />
      <Metric label="ETA" value="22 Sep 2026" density="compact" />
      <Metric label="Packages" value="18 pallets" density="compact" />
    </section>
    <div className="fds-workflow-pattern__split">
      <Panel title="Shipment details" description="Current routing and party information.">
        <dl className="fds-workflow-pattern__details">
          <div><dt>Shipper</dt><dd>PT Nusantara Example</dd></div>
          <div><dt>Consignee</dt><dd>Northstar Logistics Europe B.V.</dd></div>
          <div><dt>Carrier</dt><dd>Bluewater Shipping</dd></div>
          <div><dt>Vessel / voyage</dt><dd>Bluewater Example / 2608W</dd></div>
          <div><dt>Port of loading</dt><dd>Tanjung Priok, Jakarta</dd></div>
          <div><dt>Port of discharge</dt><dd>Rotterdam, Netherlands</dd></div>
        </dl>
      </Panel>
      <Panel eyebrow="Review" title="Current owner" description="Sample Reviewer · Documentation">
        <div className="fds-workflow-pattern__stack">
          <Metric label="Required action" value={approved ? 'None' : 'Add consignee tax ID'} density="compact" />
          <Metric label="Last updated" value="15 Aug 2026 · 14:20" density="compact" />
        </div>
      </Panel>
    </div>
    <Panel title="Documents" description="Short read-only review list.">
      <DataTable ariaLabel="Shipment document review" columns={documentColumns} rows={approved ? documents.map((document) => ({...document, status: 'approved' as const})) : documents} getRowKey={(row) => row.document} />
    </Panel>
    <Drawer title="Shipment review" description="Resolve the current exception and leave a review note." isOpen={reviewOpen} onOpenChange={setReviewOpen} dismissOnBackdrop={false} actions={<ActionGroup><Button tone="secondary" onClick={() => setReviewOpen(false)}>Cancel</Button><Button onClick={() => setReviewOpen(false)}>{approved ? 'Close review' : 'Mark resolved'}</Button></ActionGroup>}>
      <div className="fds-workflow-pattern__stack">
        <InlineAlert tone={approved ? 'success' : 'warning'} title={approved ? 'Review complete' : 'Missing information'} description={approved ? 'No further action is required.' : 'Add the consignee tax identification in RootApp before resolving this review.'} />
        <Textarea label="Review note" value={notes} onChange={setNotes} description="Visible to the shipment team." />
      </div>
    </Drawer>
  </main>;
}

const meta = {
  title: 'Patterns/Operations/Record detail and review',
  tags: ['autodocs'],
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Approved record-detail/review template composed from public FDS components and fake shipment data. It keeps summary, supporting details, evidence, and the bounded review action in one reading order.'}}},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PendingReview: Story = {render: () => <RecordDetailReview />};
export const CompletedReview: Story = {render: () => <RecordDetailReview approved />};
