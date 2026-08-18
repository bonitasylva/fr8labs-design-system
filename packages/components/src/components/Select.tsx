import {FormField} from './FormField';

export type SelectOption = {label: string; value: string};
export type SelectProps = {label: string; value: string; onChange: (value: string) => void; options: SelectOption[]; description?: string; isRequired?: boolean; isDisabled?: boolean; disabledMessage?: string; isLoading?: boolean; error?: string; placeholder?: string};
export function Select({label, value, onChange, options, description, isRequired, isDisabled, disabledMessage, isLoading, error, placeholder}: SelectProps) {
  const seenValues = new Set<string>();
  const availableOptions = options.filter((option) => {
    if (!option.value || seenValues.has(option.value)) return false;
    seenValues.add(option.value);
    return true;
  });
  const selectedValue = availableOptions.some((option) => option.value === value) ? value : '';
  const status = isLoading ? 'Loading options…' : availableOptions.length === 0 ? 'No options available.' : undefined;
  const fieldStatus = isDisabled ? disabledMessage ?? status : status;
  return <FormField label={label} description={description} error={error} required={isRequired} disabledMessage={fieldStatus}><select className="fds-control" value={selectedValue} onChange={(event) => onChange(event.target.value)} required={isRequired} disabled={isDisabled || isLoading || availableOptions.length === 0} aria-busy={isLoading || undefined}><option value="">{isLoading ? 'Loading…' : availableOptions.length === 0 ? 'No options available' : placeholder ?? 'Select an option'}</option>{availableOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FormField>;
}
