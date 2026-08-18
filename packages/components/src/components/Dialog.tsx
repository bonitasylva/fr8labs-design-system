import {useEffect, useId, useRef, type KeyboardEvent, type ReactNode} from 'react';
import {Icon} from 'sandbox-fds-icons';
import {IconButton} from './IconButton';

export type DialogProps = {title: string; description?: string; isOpen: boolean; onOpenChange: (isOpen: boolean) => void; children: ReactNode; actions?: ReactNode; dismissOnBackdrop?: boolean; role?: 'dialog' | 'alertdialog'};
type DialogSurfaceProps = DialogProps & {drawer?: boolean};
export function Dialog(props: DialogProps) {return <DialogSurface {...props} />;}

export function DialogSurface({title, description, isOpen, onOpenChange, children, actions, dismissOnBackdrop = true, role = 'dialog', drawer = false}: DialogSurfaceProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {const dialog = ref.current; if (!dialog) return; if (isOpen && !dialog.open) {dialog.showModal(); if (role === 'alertdialog') dialog.querySelector<HTMLElement>('.fds-dialog__actions button:not(:disabled)')?.focus();} if (!isOpen && dialog.open) dialog.close();}, [isOpen, role]);
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    onOpenChange(false);
  };
  return <dialog ref={ref} role={role} className={drawer ? 'fds-dialog fds-drawer' : 'fds-dialog'} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} onKeyDown={handleKeyDown} onCancel={(event) => {event.preventDefault(); onOpenChange(false);}} onClose={() => {if (isOpen) onOpenChange(false);}} onClick={(event) => {if (!dismissOnBackdrop) return; const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onOpenChange(false);}}><div className={drawer ? 'fds-dialog__body fds-drawer__body' : 'fds-dialog__body'}><header className="fds-dialog__header"><div><h2 id={titleId} className="fds-dialog__title">{title}</h2>{description ? <p id={descriptionId} className="fds-dialog__description">{description}</p> : null}</div><IconButton aria-label="Close" size="small" onClick={() => onOpenChange(false)}><Icon name="close" /></IconButton></header><div className={drawer ? 'fds-drawer__content' : 'fds-dialog__content'} tabIndex={drawer ? 0 : undefined}>{children}</div>{actions ? <footer className="fds-dialog__actions">{actions}</footer> : null}</div></dialog>;
}
