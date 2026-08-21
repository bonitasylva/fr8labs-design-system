import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {userEvent} from 'storybook/test';
import {ActionGroup, Button, FDSDataGrid, StatusBadge, type FDSDataGridColumn} from '../index';

type Shipment = {
  id: string;
  mode: string;
  route: string;
  eta: string;
  pieces: number;
  status: 'draft' | 'pending' | 'approved' | 'blocked';
};

const shipments: Shipment[] = [
  {id: 'SHP-260081', mode: 'Ocean · LCL', route: 'Jakarta → Rotterdam', eta: '22 Aug 2026', pieces: 18, status: 'pending'},
  {id: 'SHP-260082', mode: 'Air', route: 'Singapore → Jakarta', eta: '18 Aug 2026', pieces: 6, status: 'approved'},
  {id: 'SHP-260083', mode: 'Ocean · FCL', route: 'Surabaya → Busan', eta: '27 Aug 2026', pieces: 42, status: 'blocked'},
  {id: 'SHP-260084', mode: 'Road', route: 'Jakarta → Bandung', eta: '16 Aug 2026', pieces: 12, status: 'draft'},
  {id: 'SHP-260085', mode: 'Air', route: 'Bangkok → Jakarta', eta: '20 Aug 2026', pieces: 9, status: 'pending'},
];

const columns: readonly FDSDataGridColumn<Shipment>[] = [
  {field: 'id', header: 'Shipment', pinned: 'left', width: 132},
  {field: 'route', header: 'Route', minWidth: 210, flex: 1},
  {field: 'mode', header: 'Mode', width: 120},
  {field: 'eta', header: 'ETA', width: 128},
  {field: 'pieces', header: 'Pieces', width: 96, align: 'numeric'},
  {field: 'status', header: 'Status', width: 120, renderCell: (row) => <StatusBadge status={row.status} />},
];

function SelectableShipmentReview() {
  const [selected, setSelected] = useState<readonly Shipment[]>([]);
  return <div style={{display: 'grid', gap: 'var(--fds-space-3)'}}>
    <ActionGroup><span role="status">{selected.length} selected</span><Button size="small" tone="secondary" disabled={!selected.length}>Assign owner</Button></ActionGroup>
    <FDSDataGrid ariaLabel="Shipment review" columns={columns} rows={shipments} getRowId={(row) => row.id} selectable onSelectionChange={setSelected} />
  </div>;
}

const meta = {
  title: 'Components/Data display/FDSDataGrid',
  component: FDSDataGrid,
  tags: ['autodocs'],
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Approved FDS integration for AG Grid 32.3.3. This bounded shipment-review slice owns FDS density, theme, keyboard/accessibility defaults, pinned identifiers, sort/filter/resize, selection, and loading/empty states.'}}},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const CompactShipmentReview: Story = {render: () => <SelectableShipmentReview />};
export const ComfortableDensity: Story = {render: () => <FDSDataGrid ariaLabel="Shipment review" columns={columns} rows={shipments} getRowId={(row) => row.id} density="comfortable" />};
export const Loading: Story = {render: () => <FDSDataGrid ariaLabel="Shipment review" columns={columns} rows={[]} getRowId={(row) => row.id} isLoading />};
export const EmptyResult: Story = {render: () => <FDSDataGrid ariaLabel="Shipment review" columns={columns} rows={[]} getRowId={(row) => row.id} emptyState={{title: 'No shipments found', description: 'Clear or change the active filters.'}} />};
export const NarrowComparison: Story = {
  parameters: {
    a11y: {config: {rules: [{id: 'scrollable-region-focusable', enabled: false}]}},
    docs: {description: {story: 'AG Grid owns keyboard entry through its tab guards and managed header/cell focus. This interaction check replaces axe’s incompatible native-scroll-container heuristic for this narrow state.'}},
  },
  render: () => <div style={{maxWidth: 480}}><FDSDataGrid ariaLabel="Shipment review" columns={columns} rows={shipments} getRowId={(row) => row.id} /></div>,
  play: async ({canvasElement}) => {
    await userEvent.tab();
    const firstHeader = canvasElement.ownerDocument.activeElement;
    const viewport = canvasElement.querySelector<HTMLElement>('.ag-center-cols-viewport');
    if (!firstHeader?.classList.contains('ag-header-cell') || !viewport) throw new Error('Keyboard focus did not enter the narrow grid header');
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}');
    await new Promise(requestAnimationFrame);
    if (canvasElement.ownerDocument.activeElement === firstHeader || viewport.scrollLeft === 0) throw new Error('Header keyboard navigation did not move focus and scroll the narrow grid');
  },
};
