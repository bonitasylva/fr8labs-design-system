import {useId} from 'react';

export type RadioProps = {label: string; value: string; checked: boolean; onChange: (value: string) => void; name: string; description?: string; isDisabled?: boolean; isRequired?: boolean};
export function Radio({label, value, checked, onChange, name, description, isDisabled, isRequired}: RadioProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;
  return <label className="fds-choice"><input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} disabled={isDisabled} required={isRequired} aria-labelledby={labelId} aria-describedby={descriptionId} /><span><strong id={labelId}>{label}</strong>{description ? <small id={descriptionId}>{description}</small> : null}</span></label>;
}
