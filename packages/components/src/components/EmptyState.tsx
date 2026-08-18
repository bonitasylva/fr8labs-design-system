import type {ReactNode} from 'react';
export type EmptyStateProps = {title: string; description?: string; action?: ReactNode; icon?: ReactNode; headingLevel?: 2 | 3 | 4 | 5 | 6};
const headingTags = {2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6'} as const;
export function EmptyState({title, description, action, icon, headingLevel = 2}: EmptyStateProps) {const Heading = headingTags[headingLevel]; return <div className="fds-empty">{icon ? <div aria-hidden="true" className="fds-empty__icon">{icon}</div> : null}<Heading className="fds-empty__title">{title}</Heading>{description ? <p>{description}</p> : null}{action}</div>;}
