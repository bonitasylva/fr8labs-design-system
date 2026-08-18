import type {Key, KeyboardEvent, ReactNode} from 'react';

export type DataTableColumnWidth = 'narrow' | 'normal' | 'wide' | 'fluid';
export type DataTableAlignment = 'start' | 'center' | 'end' | 'numeric';

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  width?: DataTableColumnWidth;
  align?: DataTableAlignment;
};

export type DataTableEmptyState = {
  title: ReactNode;
  description?: ReactNode;
};

export type DataTableProps<T> = {
  ariaLabel: string;
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowKey: (row: T, index: number) => Key;
  isLoading?: boolean;
  emptyState?: DataTableEmptyState;
};

function scrollWithArrowKey(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  event.currentTarget.scrollBy({left: event.key === 'ArrowRight' ? 64 : -64});
}

export function DataTable<T>({ariaLabel, columns, rows, getRowKey, isLoading, emptyState}: DataTableProps<T>) {
  const hasRows = rows.length > 0;
  const state = isLoading ? 'loading' : hasRows ? null : 'empty';

  return <div className="fds-data-table__scroll" role="region" aria-label={`${ariaLabel} horizontal scroll region`} tabIndex={0} onKeyDown={scrollWithArrowKey}>
    <table className="fds-data-table" aria-busy={isLoading || undefined}>
      <caption className="fds-visually-hidden">{ariaLabel}</caption>
      <colgroup>
        {columns.map((column) => <col key={column.id} className={`fds-data-table__column--${column.width ?? 'normal'}`} />)}
      </colgroup>
      <thead>
        <tr>
          {columns.map((column) => <th key={column.id} scope="col" className={`fds-data-table__cell fds-data-table__cell--${column.align ?? 'start'}`}>{column.header}</th>)}
        </tr>
      </thead>
      <tbody>
        {state ? <tr><td className="fds-data-table__state" colSpan={columns.length}>{state === 'loading' ? <span role="status" aria-live="polite">Loading {ariaLabel}…</span> : <><strong>{emptyState?.title ?? 'No data available.'}</strong>{emptyState?.description ? <span>{emptyState.description}</span> : null}</>}</td></tr> : rows.map((row, index) => <tr key={getRowKey(row, index)}>{columns.map((column) => <td key={column.id} className={`fds-data-table__cell fds-data-table__cell--${column.align ?? 'start'}`}>{column.cell(row)}</td>)}</tr>)}
      </tbody>
    </table>
  </div>;
}
