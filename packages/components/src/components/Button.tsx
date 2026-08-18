import {forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode} from 'react';

export type ButtonTone = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: ButtonTone;
  size?: ButtonSize;
  loading?: boolean;
  loadingAnnouncement?: string;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({children, tone = 'primary', size = 'medium', loading = false, loadingAnnouncement = 'Loading', fullWidth = false, startIcon, endIcon, disabled, className, type = 'button', onClick, 'aria-disabled': ariaDisabled, ...props}, ref) {
  const spinnerAtEnd = loading && !startIcon && Boolean(endIcon);
  const inactive = loading || ariaDisabled === true || ariaDisabled === 'true';
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (inactive) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return <><button {...props} ref={ref} type={type} className={['fds-button', `fds-button--${tone}`, `fds-button--${size}`, fullWidth && 'fds-button--full-width', className].filter(Boolean).join(' ')} disabled={disabled} aria-busy={loading || undefined} aria-disabled={inactive || undefined} onClick={handleClick}>{loading && !spinnerAtEnd ? <span className="fds-button__spinner" aria-hidden="true" /> : loading ? null : startIcon}{children}{spinnerAtEnd ? <span className="fds-button__spinner" aria-hidden="true" /> : loading ? null : endIcon}</button><span className="fds-visually-hidden" aria-live="polite" aria-atomic="true">{loading ? loadingAnnouncement : ''}</span></>;
});
