import type {FormHTMLAttributes, ReactNode} from 'react';
export type FilterBarProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> & {children: ReactNode; actions?: ReactNode; label?: string};
export function FilterBar({children, actions, label = 'Filters', className, ...props}: FilterBarProps) {return <form {...props} className={['fds-filter-bar', className].filter(Boolean).join(' ')} aria-label={props['aria-label'] ?? label}><div className="fds-filter-bar__fields">{children}</div>{actions ? <div className="fds-filter-bar__actions">{actions}</div> : null}</form>;}
