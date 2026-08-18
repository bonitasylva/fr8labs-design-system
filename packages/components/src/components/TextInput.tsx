import {FormField} from './FormField';

export type TextInputProps = {label: string; value: string; onChange: (value: string) => void; placeholder?: string; isRequired?: boolean; density?: 'compact' | 'default'; error?: string; description?: string; isDisabled?: boolean; disabledMessage?: string; readOnly?: boolean};
export function TextInput({label, value, onChange, placeholder, isRequired, density = 'default', error, description, isDisabled, disabledMessage, readOnly}: TextInputProps) {
  return <FormField label={label} description={description} error={error} required={isRequired} disabledMessage={isDisabled ? disabledMessage : undefined}><input className={`fds-control fds-control--${density}`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={isRequired} disabled={isDisabled} readOnly={readOnly} aria-readonly={readOnly || undefined} /></FormField>;
}
