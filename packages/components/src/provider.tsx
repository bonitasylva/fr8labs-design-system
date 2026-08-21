import type {ReactNode} from 'react';

export function FdsProvider({children}: {children: ReactNode}) {return <div className="fds-root" data-theme="light" data-fds-theme="default">{children}</div>;}
