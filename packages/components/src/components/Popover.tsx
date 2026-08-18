import {cloneElement, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactElement, type ReactNode} from 'react';
import {Icon} from 'sandbox-fds-icons';
import {IconButton} from './IconButton';
import {positionOverlay} from './positionOverlay';

type PopoverTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type PopoverProps = {title: string; trigger: ReactElement<PopoverTriggerProps>; children: ReactNode};

export function Popover({title, trigger, children}: PopoverProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const place = () => {
    if (anchorRef.current && panelRef.current) positionOverlay(anchorRef.current, panelRef.current);
  };
  const focusTrigger = () => anchorRef.current?.querySelector<HTMLElement>('[popovertarget]')?.focus();

  useEffect(() => {
    if (!open) return;
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  const handleToggle = () => {
    const panel = panelRef.current;
    const nextOpen = panel?.matches(':popover-open') ?? false;
    setOpen(nextOpen);
    if (nextOpen) {
      place();
      panel?.focus();
    } else if (panel?.contains(document.activeElement)) {
      focusTrigger();
    }
  };

  return <span ref={anchorRef} className="fds-popover-anchor">{cloneElement(trigger, {popoverTarget: id, 'aria-expanded': open, 'aria-haspopup': 'dialog'})}<div ref={panelRef} id={id} popover="auto" role="dialog" aria-labelledby={titleId} tabIndex={-1} className="fds-popover" onToggle={handleToggle} onKeyDown={(event) => {if (event.key === 'Escape') {event.preventDefault(); panelRef.current?.hidePopover(); focusTrigger();}}}><div className="fds-popover__header"><strong id={titleId}>{title}</strong><IconButton aria-label="Close" size="small" popoverTarget={id} popoverTargetAction="hide"><Icon name="close" /></IconButton></div><div className="fds-popover__content">{children}</div></div></span>;
}
