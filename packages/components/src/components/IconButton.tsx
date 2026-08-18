import {forwardRef, type ButtonHTMLAttributes, type CSSProperties, type MouseEventHandler, type ReactNode} from 'react';
import type {ButtonSize, ButtonTone} from './Button';

export type IconButtonSize = ButtonSize;
export type IconButtonTone = ButtonTone;
export type IconButtonSx = CSSProperties;

type IconButtonAccessibleName =
  | {'aria-label': string; 'aria-labelledby'?: string}
  | {'aria-label'?: string; 'aria-labelledby': string};

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'aria-labelledby' | 'children' | 'color' | 'disabled'> & IconButtonAccessibleName & {
  children: ReactNode;
  size?: IconButtonSize;
  tone?: IconButtonTone;
  disabled?: boolean;
  loading?: boolean;
  loadingAnnouncement?: string;
  sx?: IconButtonSx;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({children, size = 'medium', tone = 'tertiary', disabled = false, loading = false, loadingAnnouncement = 'Loading', sx, style, className, type = 'button', onClick, 'aria-disabled': ariaDisabled, ...props}, ref) {
  const inactive = loading || ariaDisabled === true || ariaDisabled === 'true';
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (inactive) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return <><button {...props} ref={ref} type={type} disabled={disabled} aria-busy={loading || undefined} aria-disabled={inactive || undefined} onClick={handleClick} className={['fds-button', 'fds-icon-button', `fds-button--${size}`, `fds-button--${tone}`, className].filter(Boolean).join(' ')} style={{...sx, ...style}}>{loading ? <span className="fds-button__spinner" aria-hidden="true" /> : children}</button><span className="fds-visually-hidden" aria-live="polite" aria-atomic="true">{loading ? loadingAnnouncement : ''}</span></>;
});
