import {useState} from 'react';

export type AvatarProps = {name: string; src?: string; size?: 'small' | 'medium'};

export function Avatar({name, src, size = 'medium'}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const label = name.trim() || 'Unknown user';
  const initials = label === 'Unknown user' ? '?' : label.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();

  return <span className={`fds-avatar fds-avatar--${size}`} role="img" aria-label={label}>{src && failedSrc !== src ? <img src={src} alt="" onError={() => setFailedSrc(src)} /> : <span aria-hidden="true">{initials}</span>}</span>;
}
