import {forwardRef, type HTMLAttributes, type ReactNode} from 'react';

export type ActionGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  align?: 'start' | 'end';
};

export const ActionGroup = forwardRef<HTMLDivElement, ActionGroupProps>(function ActionGroup({children, align = 'end', className, ...props}, ref) {
  return <div {...props} ref={ref} className={['fds-action-group', `fds-action-group--${align}`, className].filter(Boolean).join(' ')}>{children}</div>;
});
