import {cloneElement, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode} from 'react';
import {positionOverlay} from './positionOverlay';

type TooltipTriggerProps = {'aria-describedby'?: string};
export type TooltipProps = {content: ReactNode; children: ReactElement<TooltipTriggerProps>};

export function Tooltip({content, children}: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const describedBy = [children.props['aria-describedby'], id].filter(Boolean).join(' ');
  const hide = () => {
    window.clearTimeout(timerRef.current);
    if (tooltipRef.current?.matches(':popover-open')) tooltipRef.current.hidePopover();
  };
  const show = () => {
    const anchor = anchorRef.current;
    const tooltip = tooltipRef.current;
    if (!anchor || !tooltip || tooltip.matches(':popover-open')) return;
    tooltip.showPopover();
    positionOverlay(anchor, tooltip, 'center');
  };
  const delayShow = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(show, 400);
  };
  const handleBlur: HTMLAttributes<HTMLSpanElement>['onBlur'] = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) hide();
  };

  return <span ref={anchorRef} className="fds-tooltip-anchor" onMouseEnter={delayShow} onMouseLeave={hide} onFocus={show} onBlur={handleBlur} onKeyDown={(event) => {if (event.key === 'Escape') hide();}}>{cloneElement(children, {'aria-describedby': describedBy})}<div ref={tooltipRef} id={id} role="tooltip" popover="manual" className="fds-tooltip">{content}</div></span>;
}
