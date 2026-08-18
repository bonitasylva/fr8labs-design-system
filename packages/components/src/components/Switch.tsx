import {useId} from 'react';

export type SwitchProps = {label: string; checked: boolean; onChange: (checked: boolean) => void; description?: string; isDisabled?: boolean; disabledMessage?: string};
export function Switch({label, checked, onChange, description, isDisabled, disabledMessage}: SwitchProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;
  const disabledMessageId = isDisabled && disabledMessage ? `${id}-disabled` : undefined;
  const describedBy = [descriptionId, disabledMessageId].filter(Boolean).join(' ') || undefined;
  return <label className="fds-switch"><button type="button" role="switch" aria-checked={checked} aria-labelledby={labelId} aria-describedby={describedBy} disabled={isDisabled} onClick={() => onChange(!checked)}><span aria-hidden="true" /></button><span><strong id={labelId}>{label}</strong>{description ? <small id={descriptionId}>{description}</small> : null}{isDisabled && disabledMessage ? <small id={disabledMessageId}>{disabledMessage}</small> : null}</span></label>;
}
