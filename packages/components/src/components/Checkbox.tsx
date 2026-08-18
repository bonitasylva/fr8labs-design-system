import {useEffect, useId, useRef} from 'react';
export type CheckboxProps = {label: string; checked: boolean | 'indeterminate'; onChange: (checked: boolean) => void; description?: string; isDisabled?: boolean; disabledMessage?: string; name?: string; value?: string};
export function Checkbox({label, checked, onChange, description, isDisabled, disabledMessage, name, value}: CheckboxProps) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;
  const disabledMessageId = isDisabled && disabledMessage ? `${id}-disabled` : undefined;
  const describedBy = [descriptionId, disabledMessageId].filter(Boolean).join(' ') || undefined;
  useEffect(() => {if (ref.current) ref.current.indeterminate = checked === 'indeterminate';}, [checked]);
  return <label className="fds-choice"><input ref={ref} type="checkbox" checked={checked === true} onChange={(event) => onChange(event.target.checked)} disabled={isDisabled} name={name} value={value} aria-labelledby={labelId} aria-describedby={describedBy} /><span><strong id={labelId}>{label}</strong>{description ? <small id={descriptionId}>{description}</small> : null}{isDisabled && disabledMessage ? <small id={disabledMessageId}>{disabledMessage}</small> : null}</span></label>;
}
