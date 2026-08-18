import type {ReactNode} from 'react';
import {Button} from './Button';
import type {InlineAlertTone} from './InlineAlert';
import {InlineAlert} from './InlineAlert';

export type NotificationProps = {
  /** Supporting message content. `description` takes precedence when both are provided. */
  children?: ReactNode;
  /** Sets the status color, icon, and announcement urgency. */
  tone?: InlineAlertTone;
  /** Optionally summarizes the notification. */
  title?: ReactNode;
  /** Provides the short notification message. */
  description?: ReactNode;
  /** Structures a short set of created or affected items. */
  list?: ReactNode[];
  /** Provides the notification's single follow-up command using the default action button. */
  action?: {label: ReactNode; onClick: () => void};
  /** Labels the dismiss button for assistive technology. */
  dismissIconAriaLabel?: string;
  /** Runs after the user dismisses the notification. */
  onDismiss?: () => void;
};

export function Notification({tone = 'info', action, ...props}: NotificationProps) {
  return <div className="fds-notification"><InlineAlert {...props} tone={tone} action={action ? <Button size="small" tone="tertiary" onClick={action.onClick}>{action.label}</Button> : undefined} /></div>;
}
