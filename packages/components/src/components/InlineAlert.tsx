import {useState, type ReactNode} from 'react';
import {Icon} from 'sandbox-fds-icons';

export type InlineAlertTone = 'info' | 'success' | 'warning' | 'error';
export type InlineAlertSize = 'small' | 'medium' | 'large';

export type InlineAlertProps = {
  /** Supporting message content. `description` takes precedence when both are provided. */
  children?: ReactNode;
  /** Sets the status color, icon, and announcement urgency. */
  tone?: InlineAlertTone;
  /** Optionally summarizes the message. */
  title?: ReactNode;
  /** Provides the core contextual guidance. */
  description?: ReactNode;
  /** Structures related details beneath the supporting message. */
  list?: ReactNode[];
  /** Provides one direct follow-up or recovery action using a non-primary button. */
  action?: ReactNode;
  /** Scales the type, icon, and internal spacing together. */
  size?: InlineAlertSize;
  /** Removes the dismiss action; the implementing workflow must remove the message when resolved. */
  persistent?: boolean;
  /** Labels the dismiss button for assistive technology. */
  dismissIconAriaLabel?: string;
  /** Runs after the user dismisses the message. */
  onDismiss?: () => void;
};

const toneIcons: Record<InlineAlertTone, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

export function InlineAlert({
  children,
  tone = 'error',
  title,
  description,
  list,
  action,
  size = 'medium',
  persistent = false,
  dismissIconAriaLabel = 'Dismiss',
  onDismiss,
}: InlineAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const message = description ?? children;
  const role = tone === 'error' ? 'alert' : 'status';
  const structured = title != null || Boolean(list?.length) || Boolean(action);

  if (dismissed) return null;

  return <div className={`fds-inline-alert fds-inline-alert--${tone} fds-inline-alert--${size}${structured ? ' fds-inline-alert--structured' : ''}`} role={role} aria-atomic="true">
    <span className="fds-inline-alert__status-icon" aria-hidden="true"><Icon name={toneIcons[tone]} size={size === 'small' ? 16 : 20} /></span>
    <div className="fds-inline-alert__content">
      {title != null ? <strong className="fds-inline-alert__title">{title}</strong> : null}
      {message != null ? <div className="fds-inline-alert__description">{message}</div> : null}
      {list?.length ? <ul className="fds-inline-alert__list">{list.map((item, index) => <li key={index}>{item}</li>)}</ul> : null}
      {action ? <div className="fds-inline-alert__action">{action}</div> : null}
    </div>
    {!persistent ? <button type="button" className="fds-inline-alert__dismiss" aria-label={dismissIconAriaLabel} onClick={() => {setDismissed(true); onDismiss?.();}}><Icon name="close" size={size === 'small' ? 16 : 20} /></button> : null}
  </div>;
}
