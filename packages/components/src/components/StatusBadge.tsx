export type Status = 'draft' | 'pending' | 'approved' | 'rejected' | 'blocked' | 'paid' | 'overdue';
export type StatusBadgeProps = {status: Status; label?: string};
const toneByStatus: Record<Status, 'normal' | 'success' | 'warning' | 'danger'> = {
  draft: 'normal', pending: 'warning', approved: 'success', rejected: 'danger',
  blocked: 'warning', paid: 'success', overdue: 'danger',
};

export function StatusBadge({status, label}: StatusBadgeProps) {return <span className={`fds-status fds-status--${toneByStatus[status]}`}>{label ?? status.charAt(0).toUpperCase() + status.slice(1)}</span>;}
