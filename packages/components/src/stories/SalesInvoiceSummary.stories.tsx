import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button, Dialog, InlineAlert, Metric, Panel, StatusBadge} from '../index';
import './SalesInvoiceSummary.stories.css';

type Invoice = {
  amountDue: string;
  amountPaid: string;
  customer: string;
  dueDate: string;
  invoiceNo: string;
  jobNo: string;
  partner: string;
  paymentNote?: string;
  status: 'pending' | 'overdue' | 'paid';
  statusLabel: string;
};

const normalInvoice: Invoice = {
  invoiceNo: 'INV-AR-2026-00481',
  jobNo: 'JKT-EXP-260701',
  customer: 'PT Nusantara Example',
  partner: 'Bluewater Shipping',
  status: 'pending',
  statusLabel: 'OPEN',
  dueDate: '18 Jul 2026',
  amountDue: 'USD 12,480.00',
  amountPaid: 'USD 3,500.00',
  paymentNote: 'Last payment 2 Jul 2026',
};

const overdueInvoice: Invoice = {...normalInvoice, status: 'overdue', statusLabel: 'OVERDUE', dueDate: '18 Jun 2026', paymentNote: '30 days past due'};
const paidInvoice: Invoice = {...normalInvoice, status: 'paid', statusLabel: 'PAID', amountDue: 'USD 0.00', amountPaid: 'USD 12,480.00', paymentNote: 'Paid in full 2 Jul 2026'};
const longValueInvoice: Invoice = {...normalInvoice, invoiceNo: 'INV-AR-2026-00481-INDONESIA-CONSOLIDATION', jobNo: 'JKT-EXP-260701-MULTI-CONSIGNEE-CONSOLIDATION', customer: 'Example Trading and Logistics Indonesia', partner: 'Example Ocean Carrier — Jakarta Branch', amountDue: 'USD 1,248,480.00'};

const meta = {
  title: 'Patterns/Finance/Sales Invoice Summary',
  tags: ['autodocs', 'experimental'],
  parameters: {
    fds: {approved: false, status: 'experimental'},
    docs: {description: {component: 'Experimental freight accounting pattern composed only from public FDS UI components and synthetic data.'}},
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SalesInvoiceSummary({invoice}: {invoice: Invoice}) {
  const [identityOpen, setIdentityOpen] = useState(false);
  const isOverdue = invoice.status === 'overdue';

  return <main className="fds-sales-invoice-summary" aria-label="Sales invoice summary">
    {isOverdue ? <InlineAlert tone="warning" title="Payment follow-up required">Invoice {invoice.invoiceNo} is overdue by 30 days. Contact the customer before the next credit review.</InlineAlert> : null}
    <Panel eyebrow="Sales invoice" title={invoice.invoiceNo} description={`Job ${invoice.jobNo} · ${invoice.customer}`} actions={<Button size="small" onClick={() => setIdentityOpen(true)}>View identity</Button>}>
      <section className="fds-sales-invoice-summary__metrics" aria-label="Invoice financial summary">
        <Metric label="Status" value={<StatusBadge status={invoice.status} label={invoice.statusLabel} />} density="compact" />
        <Metric label="Due date" value={invoice.dueDate} density="compact" />
        <Metric label="Amount due" value={invoice.amountDue} density="compact" />
        <Metric label="Amount paid" value={invoice.amountPaid} description={invoice.paymentNote} density="compact" />
      </section>
    </Panel>
    <Dialog title="Invoice identity" description="Read-only synthetic invoice identity details." isOpen={identityOpen} onOpenChange={setIdentityOpen} actions={<Button onClick={() => setIdentityOpen(false)}>Close</Button>}>
      <dl className="fds-sales-invoice-summary__identity">
        <div><dt>Invoice no.</dt><dd>{invoice.invoiceNo}</dd></div>
        <div><dt>Job no.</dt><dd>{invoice.jobNo}</dd></div>
        <div><dt>Customer</dt><dd>{invoice.customer}</dd></div>
        <div><dt>Billing partner</dt><dd>{invoice.partner}</dd></div>
        <div><dt>Currency</dt><dd>USD</dd></div>
      </dl>
    </Dialog>
  </main>;
}

export const NormalInvoice: Story = {render: () => <SalesInvoiceSummary invoice={normalInvoice} />};
export const OverdueWarning: Story = {render: () => <SalesInvoiceSummary invoice={overdueInvoice} />};
export const PaidInvoice: Story = {render: () => <SalesInvoiceSummary invoice={paidInvoice} />};
export const LongInvoiceAndPartnerValues: Story = {render: () => <SalesInvoiceSummary invoice={longValueInvoice} />};
export const Compact1024: Story = {render: () => <SalesInvoiceSummary invoice={normalInvoice} />, parameters: {docs: {description: {story: 'At 1024px, the metrics compact to two columns.'}}}};
