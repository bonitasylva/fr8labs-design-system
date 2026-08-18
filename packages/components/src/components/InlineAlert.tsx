import type {ReactNode} from 'react';

export type InlineAlertTone = 'info' | 'success' | 'warning' | 'error';

export type InlineAlertProps = {
  children?: ReactNode;
  tone?: InlineAlertTone;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function InlineAlert({children, tone = 'error', title, description, action}: InlineAlertProps) {
  const message = description ?? children;
  const role = tone === 'error' ? 'alert' : 'status';

  return <div className={`fds-inline-alert fds-inline-alert--${tone}`} role={role}>
    <div className="fds-inline-alert__content">
      {title ? <strong className="fds-inline-alert__title">{title}</strong> : null}
      {message ? <div className="fds-inline-alert__description">{message}</div> : null}
    </div>
    {action ? <div className="fds-inline-alert__action">{action}</div> : null}
  </div>;
}
