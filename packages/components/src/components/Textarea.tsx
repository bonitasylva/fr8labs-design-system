import {FormField} from './FormField';

export type TextareaProps = {label: string; value: string; onChange: (value: string) => void; description?: string; error?: string; isRequired?: boolean; isDisabled?: boolean; readOnly?: boolean; placeholder?: string; rows?: number};
export function Textarea({label, value, onChange, description, error, isRequired, isDisabled, readOnly, placeholder, rows = 4}: TextareaProps) {
  return <FormField label={label} description={description} error={error} required={isRequired}><textarea className="fds-control fds-textarea" value={value} onChange={(event) => onChange(event.target.value)} disabled={isDisabled} readOnly={readOnly} required={isRequired} placeholder={placeholder} rows={rows} /></FormField>;
}
