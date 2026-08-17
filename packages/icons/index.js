import {createElement} from 'react';

export function Icon({name, label, size = 20, className, ...props}) {
  return createElement('span', {
    ...props,
    className: ['material-symbols-sharp', 'fds-icon', `fds-icon--${size}`, className].filter(Boolean).join(' '),
    'aria-hidden': label ? undefined : true,
    'aria-label': label,
    role: label ? 'img' : undefined,
    children: name,
  });
}
