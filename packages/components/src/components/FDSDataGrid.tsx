import {useState} from 'react';
import type {ReactNode} from 'react';
import type {ColDef, ICellRendererParams, RowSelectionOptions, SelectionChangedEvent, SelectionColumnDef} from 'ag-grid-community';
import {AgGridReact} from 'ag-grid-react';

export type FDSDataGridDensity = 'compact' | 'comfortable';
export type FDSDataGridAlignment = 'start' | 'center' | 'numeric';

export type FDSDataGridColumn<T extends object> = {
  field: NonNullable<ColDef<T>['field']>;
  header: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  pinned?: 'left' | 'right';
  align?: FDSDataGridAlignment;
  sortable?: boolean;
  filter?: boolean;
  renderCell?: (row: T) => ReactNode;
};

export type FDSDataGridEmptyState = {
  title: string;
  description?: string;
};

export type FDSDataGridProps<T extends object> = {
  ariaLabel: string;
  columns: readonly FDSDataGridColumn<T>[];
  rows: readonly T[];
  getRowId: (row: T) => string;
  density?: FDSDataGridDensity;
  height?: number | string;
  isLoading?: boolean;
  emptyState?: FDSDataGridEmptyState;
  selectable?: boolean;
  onSelectionChange?: (rows: readonly T[]) => void;
};

const densitySize = {
  compact: {header: 36, row: 32},
  comfortable: {header: 44, row: 40},
};

const multiRowSelection: RowSelectionOptions = {mode: 'multiRow', selectAll: 'filtered'};
const selectionColumn: SelectionColumnDef = {lockPinned: true, maxWidth: 40, minWidth: 40, pinned: 'left', resizable: false, width: 40};

function LoadingOverlay({label}: {label: string}) {
  return <div className="fds-data-grid__overlay">Loading {label}…</div>;
}

function EmptyOverlay({title, description}: FDSDataGridEmptyState) {
  return <div className="fds-data-grid__overlay"><strong>{title}</strong>{description ? <span>{description}</span> : null}</div>;
}

export function FDSDataGrid<T extends object>({ariaLabel, columns, rows, getRowId, density = 'compact', height = 320, isLoading = false, emptyState = {title: 'No data available.'}, selectable = false, onSelectionChange}: FDSDataGridProps<T>) {
  const [selectedCount, setSelectedCount] = useState(0);
  const sizes = densitySize[density];
  const columnDefs: ColDef<T>[] = columns.map((column) => ({
    field: column.field,
    headerName: column.header,
    width: column.width,
    minWidth: column.minWidth,
    flex: column.flex,
    pinned: column.pinned,
    sortable: column.sortable,
    filter: column.filter,
    cellClass: column.align ? `fds-data-grid__cell--${column.align}` : undefined,
    headerClass: column.align ? `fds-data-grid__header--${column.align}` : undefined,
    cellRenderer: column.renderCell ? ({data}: ICellRendererParams<T>) => data ? column.renderCell?.(data) : null : undefined,
  }));

  function handleSelectionChanged(event: SelectionChangedEvent<T>) {
    const selectedRows = event.api.getSelectedRows();
    setSelectedCount(selectedRows.length);
    onSelectionChange?.(selectedRows);
  }

  return <div className={`fds-data-grid fds-data-grid--${density} ag-theme-quartz`} style={{height}} aria-busy={isLoading || undefined}>
    <span className="fds-visually-hidden" role="status" aria-live="polite">{isLoading ? `Loading ${ariaLabel}.` : selectedCount ? `${selectedCount} rows selected in ${ariaLabel}.` : rows.length ? `${rows.length} rows in ${ariaLabel}.` : `${emptyState.title} in ${ariaLabel}.`}</span>
    <AgGridReact<T>
      rowData={[...rows]}
      columnDefs={columnDefs}
      defaultColDef={{filter: true, minWidth: 96, resizable: true, sortable: true}}
      getRowId={({data}) => getRowId(data)}
      rowHeight={sizes.row}
      headerHeight={sizes.header}
      rowSelection={selectable ? multiRowSelection : undefined}
      selectionColumnDef={selectable ? selectionColumn : undefined}
      onSelectionChanged={selectable ? handleSelectionChanged : undefined}
      loading={isLoading}
      loadingOverlayComponent={LoadingOverlay}
      loadingOverlayComponentParams={{label: ariaLabel}}
      noRowsOverlayComponent={EmptyOverlay}
      noRowsOverlayComponentParams={emptyState}
      onGridReady={({api}) => api.setGridAriaProperty('label', ariaLabel)}
      animateRows={false}
    />
  </div>;
}
