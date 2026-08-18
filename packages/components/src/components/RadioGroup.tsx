import {useId} from 'react';
import {Radio} from './Radio';

export type RadioOption = {label: string; value: string; description?: string};
export type RadioGroupProps = {label: string; value: string; onChange: (value: string) => void; options: RadioOption[]; name?: string; description?: string; isRequired?: boolean; isDisabled?: boolean; disabledMessage?: string; error?: string};
export function RadioGroup({label, value, onChange, options, name, description, isRequired, isDisabled, disabledMessage, error}: RadioGroupProps) {
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
  return <fieldset className="fds-choice-group" disabled={isDisabled} aria-invalid={error ? true : undefined} aria-describedby={describedBy}><legend>{label}{isRequired ? <span aria-hidden="true"> *</span> : null}</legend>{description ? <div id={descriptionId} className="fds-field__help">{description}</div> : null}{availableOptions.map((option) => <Radio key={option.value} label={option.label} value={option.value} checked={value === option.value} onChange={onChange} name={name ?? id} description={option.description} isRequired={isRequired} />)}{availableOptions.length === 0 ? <div id={emptyId} className="fds-field__help">No options available.</div> : null}{isDisabled && disabledMessage ? <div id={disabledMessageId} className="fds-field__help">{disabledMessage}</div> : null}{error ? <div id={errorId} className="fds-field__error">{error}</div> : null}</fieldset>;
}
