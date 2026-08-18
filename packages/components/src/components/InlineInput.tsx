import {useId} from 'react';

export type InlineInputDensity = 'default' | 'compact';

export type InlineInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  density?: InlineInputDensity;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  inputMode?: 'decimal' | 'email' | 'numeric' | 'search' | 'tel' | 'text' | 'url';
  textAlign?: 'start' | 'end';
};

export function InlineInput({label, value, onChange, placeholder, density = 'default', disabled, error, helpText, inputMode, textAlign = 'end'}: InlineInputProps) {
  const hintId = useId();
  const hint = error ?? helpText;

  return <div className={`fds-inline-input fds-inline-input--${density} fds-inline-input--${textAlign}`}>
    <input aria-label={label} aria-describedby={hint ? hintId : undefined} aria-invalid={Boolean(error)} disabled={disabled} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
    {hint ? <div className={error ? 'fds-inline-input__error' : 'fds-inline-input__help'} id={hintId}>{hint}</div> : null}
  </div>;
}
