import {cloneElement, useId, type ReactElement} from 'react';

export type FormFieldProps = {label: string; children: ReactElement<{id?: string; required?: boolean; 'aria-describedby'?: string; 'aria-invalid'?: boolean | 'true' | 'false'}>; description?: string; error?: string; required?: boolean; disabledMessage?: string};

export function FormField({label, children, description, error, required, disabledMessage}: FormFieldProps) {
  const generatedId = useId();
  const id = children.props.id ?? generatedId;
  const helpId = `${id}-help`;
  const messages = [description, disabledMessage, error].filter((message): message is string => Boolean(message));
  const describedBy = [children.props['aria-describedby'], messages.length ? helpId : undefined].filter(Boolean).join(' ') || undefined;
  return <div className="fds-field"><label className="fds-field__label" htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label>{cloneElement(children, {id, required: children.props.required ?? required, 'aria-describedby': describedBy, 'aria-invalid': error ? true : children.props['aria-invalid']})}{messages.length ? <div id={helpId} className={error ? 'fds-field__error' : 'fds-field__help'}>{messages.map((message, index) => <div key={`${index}-${message}`}>{message}</div>)}</div> : null}</div>;
}
