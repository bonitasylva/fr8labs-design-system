import {useId} from 'react';
import {Checkbox} from './Checkbox';

export type CheckboxOption = {label: string; value: string; description?: string};
export type CheckboxGroupProps = {label: string; values: string[]; onChange: (values: string[]) => void; options: CheckboxOption[]; name?: string; description?: string; isRequired?: boolean; isDisabled?: boolean; disabledMessage?: string; error?: string};
export function CheckboxGroup({label, values, onChange, options, name, description, isRequired, isDisabled, disabledMessage, error}: CheckboxGroupProps) {
  const id = useId();
  const seenValues = new Set<string>();
  const availableOptions = options.filter((option) => {
    if (!option.value || seenValues.has(option.value)) return false;
    seenValues.add(option.value);
    return true;
  });
  const descriptionId = description ? `${id}-description` : undefined;
  const disabledMessageId = isDisabled && disabledMessage ? `${id}-disabled` : undefined;
  const emptyId = availableOptions.length === 0 ? `${id}-empty` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, disabledMessageId, emptyId, errorId].filter(Boolean).join(' ') || undefined;
  return <fieldset className="fds-choice-group" disabled={isDisabled} aria-invalid={error ? true : undefined} aria-describedby={describedBy}><legend>{label}{isRequired ? <span aria-hidden="true"> *</span> : null}</legend>{description ? <div id={descriptionId} className="fds-field__help">{description}</div> : null}{availableOptions.map((option) => <Checkbox key={option.value} label={option.label} checked={values.includes(option.value)} onChange={(checked) => onChange(checked ? [...values, option.value] : values.filter((value) => value !== option.value))} description={option.description} name={name ?? id} value={option.value} />)}{availableOptions.length === 0 ? <div id={emptyId} className="fds-field__help">No options available.</div> : null}{isDisabled && disabledMessage ? <div id={disabledMessageId} className="fds-field__help">{disabledMessage}</div> : null}{error ? <div id={errorId} className="fds-field__error">{error}</div> : null}</fieldset>;
}
