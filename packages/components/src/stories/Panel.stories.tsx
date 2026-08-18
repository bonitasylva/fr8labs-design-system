import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button} from '../components/Button';
import {Panel} from '../components/Panel';
import {StatusBadge} from '../components/StatusBadge';

const meta = {title: 'Components/Layout/Panel', component: Panel, tags: ['autodocs'], parameters: {fds: {approved: true, status: 'approved'}}} satisfies Meta<typeof Panel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicContent: Story = {args: {children: 'Freight charges are ready for review.'}, render: () => <Panel><p>Freight charges are ready for review.</p></Panel>};
export const TitleAndDescription: Story = {args: {children: 'House bill and carrier draft are available.'}, render: () => <Panel eyebrow="Shipment" title="Jakarta to Rotterdam consolidation" description="Ocean export shipment arriving 14 August 2026."><p>House bill and carrier draft are available.</p></Panel>};
export const HeaderAction: Story = {args: {children: 'Permission: accounting approver required to post.'}, render: () => <Panel title="Invoice review" actions={<Button size="small">Send for approval</Button>}><p>Permission: accounting approver required to post.</p></Panel>};
export const CompactFreightContent: Story = {args: {children: 'Shipment summary'}, render: () => <Panel eyebrow="JOB-SEA-24018" title="Jakarta to Rotterdam consolidation" description="Ocean export · LCL consol" actions={<StatusBadge status="pending" label="Pending documents" />}><dl style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(8rem, 1fr))', gap: '0.75rem', margin: 0}}><div><dt>HBL</dt><dd>HBL-JKT-9918</dd></div><div><dt>MBL</dt><dd>MBL-MSC-7821</dd></div><div><dt>ETA</dt><dd>2026-08-14</dd></div><div><dt>Mode</dt><dd>Ocean export</dd></div></dl></Panel>};
