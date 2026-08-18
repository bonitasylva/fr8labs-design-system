import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {ActionGroup, Button, DataTable, FilterBar, Metric, PageHeader, Pagination, Panel, Select, StatusBadge, TextInput} from '../index';
import type {DataTableColumn} from '../index';
import './WorkflowPatterns.stories.css';

type ShipmentRow = {
  eta: string;
  id: string;
  mode: string;
  route: string;
  status: 'draft' | 'pending' | 'approved' | 'blocked';
};

const shipments: ShipmentRow[] = [
  {id: 'SHP-260081', mode: 'Ocean · LCL', route: 'Jakarta → Rotterdam', eta: '22 Aug 2026', status: 'pending'},
  {id: 'SHP-260082', mode: 'Air', route: 'Singapore → Jakarta', eta: '18 Aug 2026', status: 'approved'},
  {id: 'SHP-260083', mode: 'Ocean · FCL', route: 'Surabaya → Busan', eta: '27 Aug 2026', status: 'blocked'},
  {id: 'SHP-260084', mode: 'Road', route: 'Jakarta → Bandung', eta: '16 Aug 2026', status: 'draft'},
];

const columns: readonly DataTableColumn<ShipmentRow>[] = [
  {id: 'id', header: 'Shipment', cell: (row) => row.id, width: 'normal'},
  {id: 'route', header: 'Route', cell: (row) => row.route, width: 'wide'},
  {id: 'mode', header: 'Mode', cell: (row) => row.mode},
  {id: 'eta', header: 'ETA', cell: (row) => row.eta},
  {id: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} />},
];

function ListAndReview({empty = false}: {empty?: boolean}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const rows = empty ? [] : shipments.filter((shipment) => (!query || shipment.id.toLowerCase().includes(query.toLowerCase())) && (!status || shipment.status === status));

  return <main className="fds-workflow-pattern">
    <PageHeader eyebrow="Operations" title="Shipment review" description="Find active shipments, identify exceptions, and open the record that needs attention." actions={<ActionGroup><Button tone="secondary">Export</Button><Button>Create shipment</Button></ActionGroup>} />
    <section className="fds-workflow-pattern__metrics" aria-label="Shipment summary">
      <Metric label="Active shipments" value="128" density="compact" />
      <Metric label="Due this week" value="17" density="compact" />
      <Metric label="Blocked" value="4" description="Requires owner action" density="compact" />
    </section>
    <FilterBar onSubmit={(event) => event.preventDefault()} actions={<ActionGroup><Button type="button" tone="tertiary" onClick={() => {setQuery(''); setStatus('');}}>Clear</Button><Button type="submit">Apply filters</Button></ActionGroup>}>
      <TextInput label="Shipment number" value={query} onChange={setQuery} placeholder="SHP-…" density="compact" />
      <Select label="Status" value={status} onChange={setStatus} placeholder="All statuses" options={[{label: 'Draft', value: 'draft'}, {label: 'Pending', value: 'pending'}, {label: 'Approved', value: 'approved'}, {label: 'Blocked', value: 'blocked'}]} />
    </FilterBar>
    <Panel title="Shipments" description={`${rows.length} synthetic records`}>
      <div className="fds-workflow-pattern__stack">
        <DataTable ariaLabel="Shipment review results" columns={columns} rows={rows} getRowKey={(row) => row.id} emptyState={{title: 'No shipments found', description: 'Clear or change the active filters.'}} />
        <Pagination page={page} pageCount={empty ? 1 : 6} onPageChange={setPage} label="Shipment result pages" />
      </div>
    </Panel>
  </main>;
}

const meta = {
  title: 'Patterns/Operations/List and review',
  tags: ['autodocs'],
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Approved list-and-review template composed from public FDS components and fake shipment data. Use FDSDataGrid instead of DataTable when the workflow needs sorting, editing, selection, or server-backed rows.'}}},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveResults: Story = {render: () => <ListAndReview />};
export const EmptyResult: Story = {render: () => <ListAndReview empty />};
