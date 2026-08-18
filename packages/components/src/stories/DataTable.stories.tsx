import type {Meta, StoryObj} from '@storybook/react-vite';
import {DataTable, type DataTableColumn} from '../components/DataTable';
import {StatusBadge} from '../components/StatusBadge';

type Charge = {
  id: string;
  charge: string;
  partner: string;
  type: 'AR' | 'AP';
  amount: string;
  status: 'approved' | 'pending' | 'blocked';
};

const charges: Charge[] = [
  {id: 'charge-1', charge: 'Ocean freight', partner: 'Bluewater Shipping', type: 'AP', amount: 'USD 1,850.00', status: 'approved'},
  {id: 'charge-2', charge: 'Documentation fee', partner: 'Example Logistics Indonesia', type: 'AR', amount: 'USD 95.00', status: 'pending'},
  {id: 'charge-3', charge: 'Destination handling', partner: 'Northstar Freight Services', type: 'AP', amount: 'EUR 420.00', status: 'blocked'},
];

const columns: DataTableColumn<Charge>[] = [
  {id: 'charge', header: 'Charge', cell: (row) => row.charge, width: 'wide'},
  {id: 'partner', header: 'Partner', cell: (row) => row.partner, width: 'wide'},
  {id: 'type', header: 'Type', cell: (row) => row.type, width: 'narrow', align: 'center'},
  {id: 'amount', header: 'Amount', cell: (row) => row.amount, width: 'normal', align: 'numeric'},
  {id: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} />, width: 'normal'},
];

const meta = {title: 'Components/Data display/DataTable', component: DataTable, tags: ['autodocs'], parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'DataTable presents short, read-only lists and summaries with native table semantics. Use the labeled scroll region for constrained widths; sorting, editing, selection, and large operational datasets belong to FDSDataGrid.'}}}} satisfies Meta;
export default meta;
type Story = StoryObj;

const getRowKey = (row: Charge) => row.id;

export const CompactInvoiceChargeReview: Story = {render: () => <DataTable ariaLabel="Invoice charge review" columns={columns} rows={charges} getRowKey={getRowKey} />};
export const EmptyChargeList: Story = {render: () => <DataTable ariaLabel="Invoice charge review" columns={columns} rows={[]} getRowKey={getRowKey} emptyState={{title: 'No charge lines', description: 'Charges appear here after they are added to the invoice.'}} />};
export const Loading: Story = {render: () => <DataTable ariaLabel="Invoice charge review" columns={columns} rows={[]} getRowKey={getRowKey} isLoading />};
export const ConstrainedWideTable: Story = {render: () => <div style={{maxWidth: '22rem'}}><DataTable ariaLabel="Invoice charge review" columns={columns} rows={charges} getRowKey={getRowKey} /></div>};
export const LongPartnerTextAndNumericAlignment: Story = {render: () => <DataTable ariaLabel="Charge allocation review" columns={columns} rows={[{...charges[0], id: 'charge-long-partner', partner: 'Example Ocean Carrier Jakarta export operations office', amount: 'USD 12,480.00'}]} getRowKey={getRowKey} />};
